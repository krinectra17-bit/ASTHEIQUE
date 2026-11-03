-- ====================================================================
-- AESTHIQUE ECOMMERCE PLATFORM
-- Migration 03: Inventory Procedures, Stock Reservation & Audit Functions
-- ====================================================================

-- Function: Check stock availability for multiple items atomically
CREATE OR REPLACE FUNCTION public.check_stock_availability(p_items JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item JSONB;
    v_product_id UUID;
    v_variant_id UUID;
    v_quantity INT;
    v_stock_quantity INT;
    v_reserved_quantity INT;
    v_available_stock INT;
    v_is_sufficient BOOLEAN;
    v_all_available BOOLEAN := TRUE;
    v_results JSONB := '[]'::JSONB;
BEGIN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_variant_id := (v_item->>'variant_id')::UUID;
        v_quantity := (v_item->>'quantity')::INT;

        IF v_variant_id IS NOT NULL THEN
            SELECT stock_quantity, reserved_quantity
            INTO v_stock_quantity, v_reserved_quantity
            FROM public.inventory
            WHERE product_id = v_product_id AND variant_id = v_variant_id;
        ELSE
            SELECT stock_quantity, reserved_quantity
            INTO v_stock_quantity, v_reserved_quantity
            FROM public.inventory
            WHERE product_id = v_product_id AND variant_id IS NULL;
        END IF;

        IF NOT FOUND THEN
            v_stock_quantity := 0;
            v_reserved_quantity := 0;
            v_available_stock := 0;
            v_is_sufficient := FALSE;
            v_all_available := FALSE;
        ELSE
            v_available_stock := GREATEST(0, v_stock_quantity - v_reserved_quantity);
            v_is_sufficient := (v_available_stock >= v_quantity);
            IF NOT v_is_sufficient THEN
                v_all_available := FALSE;
            END IF;
        END IF;

        v_results := v_results || jsonb_build_object(
            'product_id', v_product_id,
            'variant_id', v_variant_id,
            'requested_quantity', v_quantity,
            'available_stock', v_available_stock,
            'is_sufficient', v_is_sufficient
        );
    END LOOP;

    RETURN jsonb_build_object(
        'all_available', v_all_available,
        'items', v_results
    );
END;
$$;

-- Function: Atomically reserve stock for an order attempt
CREATE OR REPLACE FUNCTION public.reserve_stock(p_items JSONB, p_reference_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item JSONB;
    v_product_id UUID;
    v_variant_id UUID;
    v_quantity INT;
    v_inventory_id UUID;
    v_stock_quantity INT;
    v_reserved_quantity INT;
    v_available_stock INT;
BEGIN
    -- 1. First Pass: Verify that all items have sufficient unreserved inventory
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_variant_id := (v_item->>'variant_id')::UUID;
        v_quantity := (v_item->>'quantity')::INT;

        IF v_variant_id IS NOT NULL THEN
            SELECT id, stock_quantity, reserved_quantity
            INTO v_inventory_id, v_stock_quantity, v_reserved_quantity
            FROM public.inventory
            WHERE product_id = v_product_id AND variant_id = v_variant_id
            FOR UPDATE;
        ELSE
            SELECT id, stock_quantity, reserved_quantity
            INTO v_inventory_id, v_stock_quantity, v_reserved_quantity
            FROM public.inventory
            WHERE product_id = v_product_id AND variant_id IS NULL
            FOR UPDATE;
        END IF;

        IF NOT FOUND THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', format('Product inventory not found for ID: %s', v_product_id)
            );
        END IF;

        v_available_stock := v_stock_quantity - v_reserved_quantity;
        IF v_available_stock < v_quantity THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', format('Insufficient stock for product ID: %s. Available: %s, Requested: %s', v_product_id, v_available_stock, v_quantity)
            );
        END IF;
    END LOOP;

    -- 2. Second Pass: Perform reservations and log movements
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_variant_id := (v_item->>'variant_id')::UUID;
        v_quantity := (v_item->>'quantity')::INT;

        IF v_variant_id IS NOT NULL THEN
            UPDATE public.inventory
            SET reserved_quantity = reserved_quantity + v_quantity,
                updated_at = NOW()
            WHERE product_id = v_product_id AND variant_id = v_variant_id
            RETURNING id INTO v_inventory_id;
        ELSE
            UPDATE public.inventory
            SET reserved_quantity = reserved_quantity + v_quantity,
                updated_at = NOW()
            WHERE product_id = v_product_id AND variant_id IS NULL
            RETURNING id INTO v_inventory_id;
        END IF;

        -- Record audit movement
        INSERT INTO public.inventory_movements (
            inventory_id,
            change_quantity,
            action_type,
            reference_id,
            reason
        ) VALUES (
            v_inventory_id,
            v_quantity,
            'order_reservation',
            p_reference_id,
            'Temporary hold during checkout process'
        );
    END LOOP;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- Function: Atomically release reserved stock upon checkout timeout or cancellation
CREATE OR REPLACE FUNCTION public.release_stock(p_items JSONB, p_reference_id TEXT, p_reason TEXT DEFAULT 'Checkout expired or cancelled')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item JSONB;
    v_product_id UUID;
    v_variant_id UUID;
    v_quantity INT;
    v_inventory_id UUID;
BEGIN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_variant_id := (v_item->>'variant_id')::UUID;
        v_quantity := (v_item->>'quantity')::INT;

        IF v_variant_id IS NOT NULL THEN
            UPDATE public.inventory
            SET reserved_quantity = GREATEST(0, reserved_quantity - v_quantity),
                updated_at = NOW()
            WHERE product_id = v_product_id AND variant_id = v_variant_id
            RETURNING id INTO v_inventory_id;
        ELSE
            UPDATE public.inventory
            SET reserved_quantity = GREATEST(0, reserved_quantity - v_quantity),
                updated_at = NOW()
            WHERE product_id = v_product_id AND variant_id IS NULL
            RETURNING id INTO v_inventory_id;
        END IF;

        IF FOUND THEN
            INSERT INTO public.inventory_movements (
                inventory_id,
                change_quantity,
                action_type,
                reference_id,
                reason
            ) VALUES (
                v_inventory_id,
                -v_quantity,
                'order_cancelled',
                p_reference_id,
                p_reason
            );
        END IF;
    END LOOP;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- Function: Atomically commit reserved stock upon successful payment / confirmed order
CREATE OR REPLACE FUNCTION public.commit_stock_reservation(p_items JSONB, p_order_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item JSONB;
    v_product_id UUID;
    v_variant_id UUID;
    v_quantity INT;
    v_inventory_id UUID;
BEGIN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_variant_id := (v_item->>'variant_id')::UUID;
        v_quantity := (v_item->>'quantity')::INT;

        IF v_variant_id IS NOT NULL THEN
            UPDATE public.inventory
            SET stock_quantity = GREATEST(0, stock_quantity - v_quantity),
                reserved_quantity = GREATEST(0, reserved_quantity - v_quantity),
                updated_at = NOW()
            WHERE product_id = v_product_id AND variant_id = v_variant_id
            RETURNING id INTO v_inventory_id;
        ELSE
            UPDATE public.inventory
            SET stock_quantity = GREATEST(0, stock_quantity - v_quantity),
                reserved_quantity = GREATEST(0, reserved_quantity - v_quantity),
                updated_at = NOW()
            WHERE product_id = v_product_id AND variant_id IS NULL
            RETURNING id INTO v_inventory_id;
        END IF;

        IF FOUND THEN
            INSERT INTO public.inventory_movements (
                inventory_id,
                change_quantity,
                action_type,
                reference_id,
                reason
            ) VALUES (
                v_inventory_id,
                -v_quantity,
                'order_fulfillment',
                p_order_id,
                'Fulfillment for confirmed customer order'
            );
        END IF;
    END LOOP;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- Function: Low Stock Alerts
CREATE OR REPLACE FUNCTION public.get_low_stock_products(p_custom_threshold INT DEFAULT NULL)
RETURNS TABLE (
    inventory_id UUID,
    product_id UUID,
    product_name TEXT,
    product_sku TEXT,
    variant_id UUID,
    variant_name TEXT,
    stock_quantity INT,
    reserved_quantity INT,
    available_stock INT,
    low_stock_threshold INT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        inv.id AS inventory_id,
        p.id AS product_id,
        p.name AS product_name,
        COALESCE(pv.sku, p.sku) AS product_sku,
        pv.id AS variant_id,
        pv.name AS variant_name,
        inv.stock_quantity,
        inv.reserved_quantity,
        (inv.stock_quantity - inv.reserved_quantity) AS available_stock,
        inv.low_stock_threshold
    FROM public.inventory inv
    JOIN public.products p ON p.id = inv.product_id
    LEFT JOIN public.product_variants pv ON pv.id = inv.variant_id
    WHERE (inv.stock_quantity - inv.reserved_quantity) <= COALESCE(p_custom_threshold, inv.low_stock_threshold)
    ORDER BY available_stock ASC;
$$;
