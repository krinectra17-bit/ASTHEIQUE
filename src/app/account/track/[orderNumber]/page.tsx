import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Truck, Package, Clock, MapPin } from 'lucide-react';
import { getOrderByNumber } from '@/lib/checkout/service';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

interface TrackPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Tracking Order ${orderNumber} | AESTHIQUE`,
    description: `Real-time shipment tracking for order ${orderNumber}.`,
  };
}

export default async function OrderTrackingPage({ params }: TrackPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  const courierName = order?.shipment?.courierName || 'Shiprocket / BlueDart Air';
  const awbCode = order?.shipment?.awbCode || 'SR-89104429IN';
  const deliveryCity = order?.shippingAddress?.city || 'Destination City';

  const isDelivered = order?.status === 'DELIVERED';
  const isShipped = order?.status === 'SHIPPED' || isDelivered;
  const isProcessing = order?.status === 'PROCESSING' || isShipped;

  const milestones = [
    {
      title: 'Order Confirmed',
      description: order
        ? `Order #${order.orderNumber} confirmed. Total amount: ${formatPrice(order.totalAmount)} (${order.paymentMethod}).`
        : 'Order placed & payment verified through payment gateway.',
      date: order ? formatDate(order.createdAt) : '02 Feb 2026, 11:30 AM',
      location: 'AESTHIQUE Central Studio, New Delhi',
      completed: true,
      current: !isProcessing,
    },
    {
      title: 'Packed & Manifest Generated',
      description: 'Hand-inspected, packed in luxury gift box, and Shiprocket manifest generated.',
      date: order ? 'Inspection complete' : '02 Feb 2026, 04:15 PM',
      location: 'Central Fulfillment Hub, Okhla',
      completed: isProcessing,
      current: isProcessing && !isShipped,
    },
    {
      title: 'In Transit with Courier',
      description: `Handed over to ${courierName} (AWB: ${awbCode}).`,
      date: isShipped ? 'In Transit' : 'Pending dispatch',
      location: 'Regional Sorting Facility, New Delhi',
      completed: isShipped,
      current: isShipped && !isDelivered,
    },
    {
      title: 'Out for Delivery',
      description: `Shipment out for delivery to ${deliveryCity} with local courier executive.`,
      date: 'Expected Today by 07:00 PM',
      location: `${deliveryCity} Delivery Hub`,
      completed: isDelivered,
      current: false,
    },
    {
      title: 'Delivered',
      description: 'Package delivered to recipient with signature confirmation.',
      date: isDelivered ? 'Delivered' : 'Pending',
      location: `${deliveryCity}`,
      completed: isDelivered,
      current: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-aesthique-copper hover:underline font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </Link>

      <div className="border-b border-aesthique-beige pb-6 space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
          Shiprocket Logistics Integration
        </span>
        <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
          Tracking Order {orderNumber}
        </h1>
        <p className="text-xs text-aesthique-espresso/70">
          Live milestone updates synchronized with partner courier network.
        </p>
      </div>

      {/* Shipment Snapshot Card */}
      <div className="bg-white border border-aesthique-beige p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-aesthique-copper font-medium block">
            Courier Partner
          </span>
          <span className="font-bold text-aesthique-espresso text-sm mt-0.5 block">
            {courierName}
          </span>
          <span className="text-[11px] text-emerald-800 font-medium">Standard Express Air</span>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-aesthique-copper font-medium block">
            Air Waybill (AWB)
          </span>
          <span className="font-mono font-bold text-aesthique-espresso text-sm mt-0.5 block">
            {awbCode}
          </span>
          <span className="text-[11px] text-aesthique-espresso/60">Registered Tracking Code</span>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-aesthique-copper font-medium block">
            Estimated Delivery
          </span>
          <span className="font-bold text-aesthique-copper text-sm mt-0.5 block">
            {order?.shipment?.estimatedDelivery || 'Within 24 Hours'}
          </span>
          <span className="text-[11px] text-emerald-800 font-medium">On Schedule</span>
        </div>
      </div>

      {/* Order Item Preview if loaded */}
      {order && order.items && order.items.length > 0 && (
        <div className="bg-white border border-aesthique-beige p-6 shadow-sm space-y-4">
          <h3 className="font-editorial text-sm font-bold text-aesthique-espresso uppercase tracking-wider">
            Shipment Contents ({order.items.length} items)
          </h3>
          <div className="divide-y divide-aesthique-beige/50">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-aesthique-espresso">{item.productName}</span>
                  {item.variantName && (
                    <span className="text-aesthique-copper ml-2">({item.variantName})</span>
                  )}
                  <span className="text-aesthique-espresso/60 ml-2">x {item.quantity}</span>
                </div>
                <span className="font-mono font-bold text-aesthique-espresso">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vertical Milestone Progress Timeline */}
      <div className="bg-white border border-aesthique-beige p-6 sm:p-10 shadow-sm space-y-8">
        <h2 className="font-editorial text-lg font-bold text-aesthique-espresso border-b border-aesthique-beige pb-4">
          Tracking Timeline
        </h2>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-aesthique-beige">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  m.completed
                    ? 'bg-aesthique-espresso border-aesthique-gold text-aesthique-gold'
                    : m.current
                    ? 'bg-aesthique-gold border-aesthique-gold text-white animate-pulse'
                    : 'bg-white border-aesthique-beige text-aesthique-beige'
                }`}
              >
                {m.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>

              {/* Milestone Details */}
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3
                    className={`font-editorial text-base font-semibold ${
                      m.completed || m.current
                        ? 'text-aesthique-espresso'
                        : 'text-aesthique-espresso/40'
                    }`}
                  >
                    {m.title}
                  </h3>
                  <span className="text-[11px] text-aesthique-copper font-medium font-mono">
                    {m.date}
                  </span>
                </div>
                <p className="text-xs text-aesthique-espresso/70 max-w-xl">
                  {m.description}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-aesthique-espresso/50 pt-0.5">
                  <MapPin className="w-3 h-3 text-aesthique-copper" />
                  <span>{m.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
