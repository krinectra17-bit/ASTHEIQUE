import React from 'react';
import { getAdminOrders } from '../actions';
import { OrdersClient } from './orders-client';

export const metadata = {
  title: 'Order Management | AESTHIQUE Admin',
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Fulfillment & Logistics
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Customer Orders Management
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Review placed orders, update processing status, and generate Shiprocket courier air waybills.
        </p>
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  );
}
