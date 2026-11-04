import React from 'react';
import { getAdminCustomers } from '../actions';
import { CustomersClient } from './customers-client';

export const metadata = {
  title: 'Customers Directory | AESTHIQUE Admin',
};

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-aesthique-beige pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Patron Directory
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Registered Customers & Profiles
        </h1>
        <p className="text-xs text-aesthique-espresso/70 mt-1">
          Review customer lifetime order counts, registered contact details, and account creation timestamps without exposing passwords or auth secrets.
        </p>
      </div>

      <CustomersClient initialCustomers={customers} />
    </div>
  );
}
