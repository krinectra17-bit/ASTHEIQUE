import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Truck, Package, Clock, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface TrackPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderTrackingPage({ params }: TrackPageProps) {
  const { orderNumber } = await params;

  const milestones = [
    {
      title: 'Order Confirmed',
      description: 'Order placed & payment verified through payment gateway.',
      date: '02 Feb 2026, 11:30 AM',
      location: 'AESTHIQUE Central Studio, New Delhi',
      completed: true,
      current: false,
    },
    {
      title: 'Packed & Manifest Generated',
      description: 'Hand-inspected, packed in luxury gift box, and Shiprocket manifest generated.',
      date: '02 Feb 2026, 04:15 PM',
      location: 'Central Fulfillment Hub, Okhla',
      completed: true,
      current: false,
    },
    {
      title: 'In Transit with Courier',
      description: 'Handed over to Shiprocket Express logistics partner (AWB: SR-89104429IN).',
      date: '03 Feb 2026, 08:45 AM',
      location: 'Regional Sorting Facility, New Delhi',
      completed: true,
      current: true,
    },
    {
      title: 'Out for Delivery',
      description: 'Shipment out for delivery with local courier executive.',
      date: 'Expected Today by 07:00 PM',
      location: 'Destination Delivery Hub',
      completed: false,
      current: false,
    },
    {
      title: 'Delivered',
      description: 'Package delivered to recipient with signature confirmation.',
      date: 'Pending',
      location: 'Customer Address',
      completed: false,
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
            Shiprocket / BlueDart Air
          </span>
          <span className="text-[11px] text-emerald-800 font-medium">Standard Express Air</span>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-aesthique-copper font-medium block">
            Air Waybill (AWB)
          </span>
          <span className="font-mono font-bold text-aesthique-espresso text-sm mt-0.5 block">
            SR-89104429IN
          </span>
          <span className="text-[11px] text-aesthique-espresso/60">Registered Tracking Code</span>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-aesthique-copper font-medium block">
            Estimated Delivery
          </span>
          <span className="font-bold text-aesthique-copper text-sm mt-0.5 block">
            Within 24 Hours
          </span>
          <span className="text-[11px] text-emerald-800 font-medium">On Schedule</span>
        </div>
      </div>

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
