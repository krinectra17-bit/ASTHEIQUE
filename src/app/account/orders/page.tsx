'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Package, Truck, ChevronRight, ArrowLeft } from 'lucide-react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aesthique_orders');
      if (saved) {
        setOrders(JSON.parse(saved));
      } else {
        // Sample baseline order for testing view
        const sampleOrder = {
          orderNumber: 'AES-2026-891044',
          items: [
            {
              id: 'sample-1',
              productName: 'Solace Sculptural Ceramic Vase',
              variantName: 'Color: Ivory Cream',
              unitPrice: 2499,
              quantity: 1,
              imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=400&q=80',
            },
          ],
          pricing: { total: 2499, subtotal: 2499, shippingFee: 0, discount: 0 },
          paymentMethod: 'RAZORPAY',
          paymentStatus: 'PAID',
          fulfillmentStatus: 'SHIPPED',
          createdAt: new Date().toISOString(),
          shippingAddress: { city: 'New Delhi', state: 'Delhi', pincode: '110021' },
        };
        setOrders([sampleOrder]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-aesthique-espresso/60">
        <Link href="/account" className="hover:text-aesthique-copper flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Account</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-aesthique-copper" />
        <span className="text-aesthique-copper font-semibold">Order History</span>
      </div>

      <div className="border-b border-aesthique-beige pb-6">
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Your Purchases
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          View invoices, fulfillment updates and Shiprocket tracking for all orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center bg-white border border-aesthique-beige p-8 space-y-4 max-w-xl mx-auto">
          <Package className="w-12 h-12 mx-auto text-aesthique-copper" />
          <h2 className="font-editorial text-xl font-bold text-aesthique-espresso">
            No Orders on Record
          </h2>
          <p className="text-xs text-aesthique-espresso/70">
            Explore our collections to place your first order.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="md">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderNumber}
              className="bg-white border border-aesthique-beige shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-aesthique-ivory/60 p-4 sm:p-5 border-b border-aesthique-beige flex flex-wrap justify-between items-center gap-4 text-xs">
                <div className="flex flex-wrap gap-6 items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-aesthique-copper font-medium block">
                      Order Number
                    </span>
                    <span className="font-bold text-aesthique-espresso font-editorial text-sm">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-aesthique-copper font-medium block">
                      Date Placed
                    </span>
                    <span className="font-medium text-aesthique-espresso">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-aesthique-copper font-medium block">
                      Total Amount
                    </span>
                    <span className="font-bold text-aesthique-espresso">
                      {formatPrice(order.pricing?.total || 0)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-bold">
                    {order.fulfillmentStatus || 'PROCESSING'}
                  </span>
                  <Link
                    href={`/account/track/${order.orderNumber}`}
                    className="inline-flex items-center gap-1.5 bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-wider font-medium px-4 py-2 hover:bg-black transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5 text-aesthique-gold" />
                    <span>Track Shipment</span>
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6 divide-y divide-aesthique-beige/50">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 bg-aesthique-ivory flex-shrink-0 border border-aesthique-beige overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <h4 className="font-editorial text-sm font-semibold text-aesthique-espresso">
                          {item.productName}
                        </h4>
                        {item.variantName && (
                          <p className="text-[11px] text-aesthique-copper">{item.variantName}</p>
                        )}
                        <p className="text-[11px] text-aesthique-espresso/60">
                          Qty: {item.quantity} • Unit: {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-aesthique-espresso">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
