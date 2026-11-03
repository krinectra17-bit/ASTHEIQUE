-- ====================================================================
-- AESTHIQUE E-COMMERCE PLATFORM — SEED DATA
-- Migration: 02_seed_data.sql
-- Description: Initial categories, products, inventory, coupons, banners
-- ====================================================================

-- 1. Insert Initial 10 Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_active)
VALUES
    ('c0000001-0000-0000-0000-000000000001', 'Home & Living', 'home-and-living', 'Elevated essentials that bring warmth, calm and tactile luxury to every room.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80', 1, true),
    ('c0000001-0000-0000-0000-000000000002', 'Kitchen Essentials', 'kitchen-essentials', 'Culinary tools and artisanal tableware designed for joyful everyday cooking and dining.', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', 2, true),
    ('c0000001-0000-0000-0000-000000000003', 'Home Decor', 'home-decor', 'Sculptural ceramics, ambient lighting, and artful accents with understated presence.', 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80', 3, true),
    ('c0000001-0000-0000-0000-000000000004', 'Personal Care', 'personal-care', 'Refined body rituals, nourishing formulas, and mindful everyday grooming essentials.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80', 4, true),
    ('c0000001-0000-0000-0000-000000000005', 'Beauty & Wellness', 'beauty-and-wellness', 'Botanical scents, soothing self-care accoutrements, and grounding sensory wellness.', 'https://images.unsplash.com/photo-1608248597359-2e11894a4b27?auto=format&fit=crop&w=1200&q=80', 5, true),
    ('c0000001-0000-0000-0000-000000000006', 'Lifestyle Accessories', 'lifestyle-accessories', 'Handcrafted leather goods, timeless desk objects, and daily companions built to endure.', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80', 6, true),
    ('c0000001-0000-0000-0000-000000000007', 'Storage & Organisation', 'storage-and-organisation', 'Harmonious storage solutions in linen, woven seagrass, and matte powder-coated metal.', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80', 7, true),
    ('c0000001-0000-0000-0000-000000000008', 'Daily Essentials', 'daily-essentials', 'The small things done right. Everyday items elevated through thoughtful craftsmanship.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80', 8, true),
    ('c0000001-0000-0000-0000-000000000009', 'Travel Essentials', 'travel-essentials', 'Refined travel cases, packing organizers, and portable luxuries for conscious journeys.', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80', 9, true),
    ('c0000001-0000-0000-0000-000000000010', 'Gifts & Collections', 'gifts-and-collections', 'Curated gift boxes and limited seasonal editions wrapped in signature champagne accents.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80', 10, true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- 2. Insert Core Lifestyle Products
INSERT INTO public.products (
    id, category_id, name, slug, sku, short_description, full_description,
    regular_price, sale_price, weight_in_grams, dimensions_cm, specifications,
    care_instructions, is_featured, is_bestseller, is_new_arrival, is_active,
    seo_title, seo_description
) VALUES
(
    'p0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000003',
    'Solace Sculptural Ceramic Vase',
    'solace-sculptural-ceramic-vase',
    'AES-DEC-001',
    'Hand-thrown stoneware vase with raw matte texture and organic asymmetrical silhouette.',
    'The Solace Vase is handcrafted by master ceramicists using natural riverbed stoneware clay. Its raw matte exterior offers a tactile grounding presence, while the glazed interior is watertight for botanical stems or dry architectural branches. Designed as a standalone artistic sculpture or everyday floral centerpiece.',
    2899.00, 2499.00, 950,
    '{"length": 16, "breadth": 16, "height": 26}'::JSONB,
    '[{"label": "Material", "value": "High-fire Stoneware Ceramic"}, {"label": "Finish", "value": "Matte Raw Exterior, Glazed Interior"}, {"label": "Care", "value": "Hand wash only with mild soap."}]'::JSONB,
    'Clean gently using lukewarm water and neutral soap. Do not use abrasive scouring pads.',
    true, true, false, true,
    'Solace Sculptural Ceramic Vase | AESTHIQUE',
    'Handcrafted matte stoneware ceramic vase designed for understated luxury living spaces.'
),
(
    'p0000001-0000-0000-0000-000000000002',
    'c0000001-0000-0000-0000-000000000002',
    'Aura Cast Brass Coffee Pour-Over Dripper',
    'aura-cast-brass-coffee-pour-over-dripper',
    'AES-KIT-002',
    'Solid cast brass dripper with brushed champagne finish for mindful morning brews.',
    'Begin each morning with an intentional ritual. The Aura Pour-Over Dripper is cast from solid food-safe brass and hand-finished with our signature champagne patina. Engineered with precision internal flow ribs that ensure optimal water saturation and uniform extraction.',
    3499.00, 2999.00, 620,
    '{"length": 12, "breadth": 12, "height": 10}'::JSONB,
    '[{"label": "Material", "value": "100% Solid Food-Grade Brass"}, {"label": "Compatibility", "value": "Standard V60 01/02 Filters"}, {"label": "Finish", "value": "Brushed Champagne Lacquer"}]'::JSONB,
    'Rinse with warm water immediately after use. Dry thoroughly with a microfiber cloth.',
    true, true, false, true,
    'Aura Cast Brass Coffee Pour-Over Dripper | AESTHIQUE',
    'Solid cast brass manual coffee pour-over dripper with brushed champagne gold finish.'
),
(
    'p0000001-0000-0000-0000-000000000003',
    'c0000001-0000-0000-0000-000000000001',
    'Serene Pure Waffle Linen Throw Blanket',
    'serene-pure-waffle-linen-throw-blanket',
    'AES-LIV-003',
    '100% French flax linen woven in a deep honeycomb waffle texture for breathable all-season comfort.',
    'Pre-washed with organic enzymes for heirloom softness from day one. This generous throw drape brings rich texture to your sofa, reading chair, or foot of the bed. Breathable during warm summers and cozy when layered in winter.',
    4299.00, 3699.00, 850,
    '{"length": 150, "breadth": 200, "height": 1}'::JSONB,
    '[{"label": "Material", "value": "100% European Flax Linen"}, {"label": "Weave", "value": "Honeycomb Waffle Knit"}, {"label": "Dimensions", "value": "150 cm x 200 cm"}]'::JSONB,
    'Machine wash cold on gentle cycle. Tumble dry low or line dry in shade.',
    true, true, true, true,
    'Serene Pure Waffle Linen Throw Blanket | AESTHIQUE',
    'Artisanal 100% French flax waffle linen throw blanket pre-washed for heirloom comfort.'
),
(
    'p0000001-0000-0000-0000-000000000004',
    'c0000001-0000-0000-0000-000000000005',
    'Nocturne Amber & Smoked Cedar Soy Candle',
    'nocturne-amber-smoked-cedar-soy-candle',
    'AES-WEL-004',
    'Hand-poured coconut-soy wax candle in a custom ceramic vessel with double wooden wick.',
    'Notes of dark golden amber, smoked cedarwood, crushed cardamon, and warm tonka bean. Formulated using phthalate-free botanical oils and renewable wax. The crackling wooden wick emits a subtle auditory fireplace glow.',
    1699.00, 1499.00, 420,
    '{"length": 9, "breadth": 9, "height": 10}'::JSONB,
    '[{"label": "Burn Time", "value": "Approx. 55-60 hours"}, {"label": "Wax", "value": "100% Biodegradable Soy & Coconut"}, {"label": "Wick", "value": "FSC-Certified Organic Birch Wood"}]'::JSONB,
    'Trim wood wick to 1/4 inch before each lighting.',
    true, false, true, true,
    'Nocturne Amber & Smoked Cedar Soy Candle | AESTHIQUE',
    'Luxury botanical soy-coconut candle in handcrafted ceramic vessel with crackling wood wick.'
)
ON CONFLICT (slug) DO UPDATE
SET regular_price = EXCLUDED.regular_price, sale_price = EXCLUDED.sale_price;

-- 3. Insert Product Images
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
VALUES
    ('p0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80', 'Solace Sculptural Ceramic Vase Primary', 1, true),
    ('p0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80', 'Solace Vase Detail', 2, false),
    ('p0000001-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80', 'Aura Brass Dripper Primary', 1, true),
    ('p0000001-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80', 'Serene Waffle Linen Throw Primary', 1, true),
    ('p0000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80', 'Nocturne Soy Candle Primary', 1, true);

-- 4. Insert Inventory Levels
INSERT INTO public.inventory (product_id, variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
VALUES
    ('p0000001-0000-0000-0000-000000000001', NULL, 28, 0, 5),
    ('p0000001-0000-0000-0000-000000000002', NULL, 15, 0, 4),
    ('p0000001-0000-0000-0000-000000000003', NULL, 22, 0, 5),
    ('p0000001-0000-0000-0000-000000000004', NULL, 45, 0, 10)
ON CONFLICT (product_id, variant_id) DO UPDATE
SET stock_quantity = EXCLUDED.stock_quantity;

-- 5. Insert Verified Customer Reviews
INSERT INTO public.product_reviews (product_id, author_name, rating, headline, review_text, is_verified_purchase, is_approved)
VALUES
    ('p0000001-0000-0000-0000-000000000001', 'Ananya Sharma', 5, 'Exquisite craftsmanship and calming presence', 'The Solace Vase arrived in museum-grade protective packaging. The matte stoneware texture is gorgeous in morning daylight. It truly feels like an art gallery piece in my living room.', true, true),
    ('p0000001-0000-0000-0000-000000000002', 'Rohan Mehta', 5, 'Elevated my daily coffee brewing ritual', 'The solid brass has a substantial, luxurious weight. It extracts evenly and looks stunning resting on my kitchen counter. Easily my favorite purchase this year.', true, true),
    ('p0000001-0000-0000-0000-000000000003', 'Dr. Meera Sen', 5, 'Softest waffle linen I have ever owned', 'Breathable, heavy drape without feeling stifling. The Oatmeal Beige matches our minimalist bedroom palette perfectly. Will definitely be ordering the Clay color for gifting.', true, true);

-- 6. Insert Promotional Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_value, max_discount_amount, usage_limit, times_used, is_active, starts_at)
VALUES
    ('WELCOME10', 'percentage', 10.00, 999.00, 500.00, 1000, 14, true, NOW()),
    ('AESTHETIC500', 'fixed', 500.00, 2499.00, NULL, 500, 36, true, NOW()),
    ('FIRSTLIVING15', 'percentage', 15.00, 1499.00, 1000.00, 200, 21, true, NOW())
ON CONFLICT (code) DO NOTHING;

-- 7. Insert Store Settings
INSERT INTO public.store_settings (key, value, description)
VALUES
    ('shipping_thresholds', '{"free_shipping_threshold": 1999, "standard_shipping_fee": 150}'::JSONB, 'Free shipping min order amount & flat standard rate'),
    ('tax_settings', '{"gst_rate": 0.18, "prices_inclusive_of_gst": true}'::JSONB, 'Standard Indian GST percentage settings'),
    ('store_info', '{"store_name": "AESTHIQUE", "tagline": "Little Things, Better Living.", "support_email": "concierge@aesthique.com", "support_phone": "+91 98710 24500", "currency": "INR", "currency_symbol": "₹"}'::JSONB, 'Public storefront contact and currency configuration')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value;

-- 8. Insert Homepage Banners
INSERT INTO public.homepage_banners (banner_type, title, subtitle, image_url, link_url, button_text, display_order, is_active)
VALUES
    ('announcement', 'Complimentary shipping across India on orders over ₹1,999 • Use code WELCOME10 for 10% off', NULL, NULL, '/shop', NULL, 1, true),
    ('hero', 'Make Everyday Living Beautiful.', 'Thoughtfully selected essentials for a more beautiful, comfortable and effortless everyday life.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80', '/shop', 'Explore Collection', 2, true),
    ('promo', 'The Art of Mindful Spaces', 'Warm ceramics, tactile linens, and quiet functional objects designed to bring calm into modern routines.', 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=80', '/category/home-decor', 'Shop New Arrivals', 3, true);
