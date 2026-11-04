import React from 'react';
import { getAdminShipments } from '../actions';
import { ShippingClient } from './shipping-client';

export const metadata = {
  title: 'Shipping Logistics | AESTHIQUE Admin',
};

export default async function AdminShippingPage() {
  const shipments = await getAdminShipments();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Logistics Fulfillment Console
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Shipments & Courier Tracking
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Monitor Shiprocket courier allocation, generate AWBs, review dispatch milestones, and audit warehouse serviceability.
        </p>
      </div>

      <ShippingClient initialShipments={shipments} />
    </div>
  );
}
