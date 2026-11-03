'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types';
import { updateOrderStatus } from '../actions';
import { formatPrice, formatDate } from '@/lib/utils';
import { Truck, ExternalLink, ChevronDown, ChevronUp, Package, Check, X, Clock } from 'lucide-react';

interface OrdersClientProps {
  initialOrders: Order[];
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isProcessingShipment, setIsProcessingShipment] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus === 'ALL') return true;
    return o.status === selectedStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    await updateOrderStatus(orderId, newStatus);
  };

  const handleGenerateShipment = async (order: Order) => {
    setIsProcessingShipment(order.id);
    try {
      const res = await fetch('/api/shipping/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.shipment) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? {
                  ...o,
                  status: 'SHIPPED',
                  fulfillmentStatus: 'PROCESSING',
                  shipment: {
                    courierName: data.shipment.courierName,
                    awbCode: data.shipment.awbCode,
                    status: data.shipment.status,
                    trackingUrl: data.shipment.trackingUrl,
                  },
                }
              : o
          )
        );
      }
    } catch {
      // Best-effort dispatch
    } finally {
      setIsProcessingShipment(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-aesthique-beige pb-4 text-xs font-semibold uppercase tracking-wider">
        {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(
          (status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 transition-colors ${
                selectedStatus === status
                  ? 'bg-aesthique-espresso text-aesthique-ivory shadow-sm'
                  : 'bg-white text-aesthique-espresso/70 border border-aesthique-beige hover:border-aesthique-gold'
              }`}
            >
              {status} ({orders.filter((o) => status === 'ALL' || o.status === status).length})
            </button>
          )
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aesthique-ivory/60 text-aesthique-espresso/70 uppercase tracking-wider text-[10px] font-semibold border-b border-aesthique-beige">
              <tr>
                <th className="py-3 px-6">Order</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Fulfillment</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Total</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthique-beige/50">
              {filteredOrders.map((o) => {
                const isExpanded = expandedOrderId === o.id;

                return (
                  <React.Fragment key={o.id}>
                    <tr
                      onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                      className={`hover:bg-aesthique-ivory/30 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-aesthique-ivory/20' : ''
                      }`}
                    >
                      <td className="py-4 px-6 font-mono font-bold text-aesthique-espresso">
                        {o.orderNumber}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold block text-aesthique-espresso">
                          {o.shippingAddress?.fullName}
                        </span>
                        <span className="text-[11px] text-aesthique-espresso/60 block">
                          {o.customerPhone}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-aesthique-espresso/70">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            o.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.paymentStatus} ({o.paymentMethod})
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold uppercase text-[10px] tracking-wider text-aesthique-copper">
                        {o.fulfillmentStatus}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={o.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="bg-aesthique-ivory border border-aesthique-beige px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-aesthique-espresso">
                        {formatPrice(o.totalAmount)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedOrderId(isExpanded ? null : o.id);
                          }}
                          className="inline-flex items-center gap-1 text-aesthique-copper hover:text-aesthique-espresso uppercase tracking-wider text-[11px] font-semibold"
                        >
                          <span>{isExpanded ? 'Hide' : 'Details'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Order Details Panel */}
                    {isExpanded && (
                      <tr className="bg-aesthique-cream/30">
                        <td colSpan={8} className="p-6 border-b border-aesthique-beige space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                            {/* Items Preview */}
                            <div className="md:col-span-2 space-y-3">
                              <h4 className="font-editorial text-sm font-bold text-aesthique-espresso uppercase tracking-wider">
                                Order Items ({o.items?.length || 0})
                              </h4>
                              <div className="bg-white border border-aesthique-beige divide-y divide-aesthique-beige">
                                {o.items?.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 flex items-center justify-between gap-4"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="relative w-10 h-10 rounded bg-aesthique-ivory border border-aesthique-beige overflow-hidden flex-shrink-0">
                                        <Image
                                          src={item.imageUrl}
                                          alt={item.productName}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <span className="font-semibold block text-aesthique-espresso">
                                          {item.productName}
                                        </span>
                                        <span className="text-[10px] text-aesthique-copper block font-mono">
                                          {item.sku}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-mono font-bold block text-aesthique-espresso">
                                        {formatPrice(item.totalPrice)}
                                      </span>
                                      <span className="text-[10px] text-aesthique-espresso/60 block">
                                        Qty: {item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address & Dispatch Actions */}
                            <div className="space-y-4 bg-white border border-aesthique-beige p-4">
                              <div>
                                <h4 className="font-editorial text-sm font-bold text-aesthique-espresso uppercase tracking-wider mb-2">
                                  Delivery Address
                                </h4>
                                <div className="space-y-0.5 text-aesthique-espresso/80">
                                  <div className="font-semibold text-aesthique-espresso">
                                    {o.shippingAddress?.fullName}
                                  </div>
                                  <div>{o.shippingAddress?.houseNumber}, {o.shippingAddress?.street}</div>
                                  <div>
                                    {o.shippingAddress?.city}, {o.shippingAddress?.state} -{' '}
                                    <strong className="font-mono">{o.shippingAddress?.pincode}</strong>
                                  </div>
                                  <div className="text-[11px] pt-1 text-aesthique-espresso/60">
                                    Phone: {o.customerPhone}
                                  </div>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-aesthique-beige space-y-2">
                                {o.shipment?.awbCode ? (
                                  <div className="bg-aesthique-ivory p-3 border border-aesthique-beige text-xs space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-aesthique-copper block">
                                      Shiprocket AWB Booked
                                    </span>
                                    <span className="font-mono font-bold block text-aesthique-espresso">
                                      {o.shipment.awbCode}
                                    </span>
                                    <span className="text-[11px] text-aesthique-espresso/70 block">
                                      Courier: {o.shipment.courierName}
                                    </span>
                                    <Link
                                      href={`/account/track/${o.orderNumber}`}
                                      target="_blank"
                                      className="inline-flex items-center gap-1 text-[11px] text-aesthique-copper hover:underline font-semibold pt-1"
                                    >
                                      <span>Open Tracking Portal</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </Link>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleGenerateShipment(o)}
                                    disabled={isProcessingShipment === o.id}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-aesthique-espresso text-aesthique-ivory py-2.5 px-4 uppercase tracking-wider text-xs font-semibold hover:bg-black disabled:opacity-50 transition-colors"
                                  >
                                    <Truck className="w-3.5 h-3.5 text-aesthique-gold" />
                                    <span>
                                      {isProcessingShipment === o.id
                                        ? 'Allocating Courier...'
                                        : 'Book Shiprocket Courier'}
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
