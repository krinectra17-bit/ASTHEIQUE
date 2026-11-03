'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from '@/app/auth/actions';
import {
  ProfileData,
  AddressData,
  updateCustomerProfile,
  saveCustomerAddress,
  deleteCustomerAddress,
} from '@/app/account/actions';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  User,
  Heart,
  MapPin,
  LogOut,
  ShieldCheck,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Edit2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccountClientProps {
  initialProfile: ProfileData | null;
  initialAddresses: AddressData[];
}

export function AccountClient({ initialProfile, initialAddresses }: AccountClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(initialProfile);
  const [addresses, setAddresses] = useState<AddressData[]>(initialAddresses);
  const [activeTab, setActiveTab] = useState<'overview' | 'addresses' | 'profile'>('overview');

  // Profile Form state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: initialProfile?.firstName || '',
    lastName: initialProfile?.lastName || '',
    phone: initialProfile?.phone || '',
  });
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Address Modal/Form state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressData>({
    fullName: '',
    mobile: '',
    houseNumber: '',
    street: '',
    area: '',
    landmark: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    addressType: 'home',
    isDefaultShipping: true,
  });
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    const res = await updateCustomerProfile(profileForm);
    if (res.success) {
      setProfile((prev) => (prev ? { ...prev, ...profileForm } : null));
      setIsEditingProfile(false);
      setProfileMessage('Profile updated successfully.');
      setTimeout(() => setProfileMessage(null), 3000);
    } else {
      setProfileMessage(res.error || 'Failed to update profile.');
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);

    if (!/^[1-9][0-9]{5}$/.test(addressForm.pincode)) {
      setAddressError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setAddressLoading(true);
    const res = await saveCustomerAddress(addressForm);
    setAddressLoading(false);

    if (res.success) {
      setIsAddressModalOpen(false);
      setAddresses((prev) => [
        ...prev.filter((a) => a.id !== addressForm.id),
        { ...addressForm, id: addressForm.id || Math.random().toString() },
      ]);
      setAddressForm({
        fullName: '',
        mobile: '',
        houseNumber: '',
        street: '',
        area: '',
        landmark: '',
        city: '',
        state: 'Delhi',
        pincode: '',
        addressType: 'home',
        isDefaultShipping: false,
      });
    } else {
      setAddressError(res.error || 'Failed to save address.');
    }
  };

  const handleDeleteAddress = async (id?: string) => {
    if (!id) return;
    const res = await deleteCustomerAddress(id);
    if (res.success) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-aesthique-beige gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block">
            Patron Dashboard
          </span>
          <h1 className="font-editorial text-3xl font-bold text-aesthique-espresso">
            Welcome, {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Patron'}
          </h1>
          <p className="text-xs text-aesthique-espresso/70 mt-0.5">
            Logged in as {profile?.email || 'Authenticated Patron'}
          </p>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-rose-700 hover:underline"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-aesthique-beige gap-8 text-xs uppercase tracking-widest font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            'pb-3 transition-colors',
            activeTab === 'overview'
              ? 'text-aesthique-copper border-b-2 border-aesthique-copper'
              : 'text-aesthique-espresso/60 hover:text-aesthique-espresso'
          )}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={cn(
            'pb-3 transition-colors',
            activeTab === 'addresses'
              ? 'text-aesthique-copper border-b-2 border-aesthique-copper'
              : 'text-aesthique-espresso/60 hover:text-aesthique-espresso'
          )}
        >
          Address Book ({addresses.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'pb-3 transition-colors',
            activeTab === 'profile'
              ? 'text-aesthique-copper border-b-2 border-aesthique-copper'
              : 'text-aesthique-espresso/60 hover:text-aesthique-espresso'
          )}
        >
          Profile Settings
        </button>
      </div>

      {profileMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{profileMessage}</span>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/account/orders"
              className="bg-white border border-aesthique-beige p-6 shadow-sm hover:border-aesthique-gold transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-aesthique-copper font-medium block">
                  Orders & Shipments
                </span>
                <span className="font-editorial text-2xl font-bold text-aesthique-espresso block">
                  Track Orders
                </span>
                <span className="text-[11px] text-aesthique-espresso/60 group-hover:text-aesthique-copper transition-colors">
                  View Past Purchases →
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-copper">
                <Package className="w-6 h-6" />
              </div>
            </Link>

            <Link
              href="/wishlist"
              className="bg-white border border-aesthique-beige p-6 shadow-sm hover:border-aesthique-gold transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-aesthique-copper font-medium block">
                  Saved Wishlist
                </span>
                <span className="font-editorial text-2xl font-bold text-aesthique-espresso block">
                  Favorites
                </span>
                <span className="text-[11px] text-aesthique-espresso/60 group-hover:text-aesthique-copper transition-colors">
                  Open Wishlist →
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-copper">
                <Heart className="w-6 h-6" />
              </div>
            </Link>

            <div className="bg-white border border-aesthique-beige p-6 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-aesthique-copper font-medium block">
                  AESTHIQUE Tier
                </span>
                <span className="font-editorial text-2xl font-bold text-aesthique-espresso block">
                  Patron Circle
                </span>
                <span className="text-[11px] text-emerald-800 font-semibold">
                  ✓ Eligible for Express Logistics
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-aesthique-ivory flex items-center justify-center text-aesthique-gold">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Default Address Preview */}
          <div className="bg-white border border-aesthique-beige p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-aesthique-beige">
              <h3 className="font-editorial text-lg font-bold text-aesthique-espresso">
                Primary Shipping Address
              </h3>
              <button
                onClick={() => setActiveTab('addresses')}
                className="text-xs text-aesthique-copper uppercase tracking-wider font-semibold hover:underline"
              >
                Manage All Addresses →
              </button>
            </div>
            {addresses.length === 0 ? (
              <p className="text-xs text-aesthique-espresso/70">
                No shipping addresses saved yet. Add your address for faster checkout.
              </p>
            ) : (
              <div className="text-xs text-aesthique-espresso/80 space-y-1">
                <p className="font-bold text-aesthique-espresso">{addresses[0].fullName}</p>
                <p>{addresses[0].houseNumber}, {addresses[0].street}</p>
                {addresses[0].area && <p>{addresses[0].area}</p>}
                <p>{addresses[0].city}, {addresses[0].state} - {addresses[0].pincode}</p>
                <p>Phone: {addresses[0].mobile}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ADDRESS BOOK */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-editorial text-xl font-bold text-aesthique-espresso">
              Saved Delivery Addresses
            </h3>
            <button
              onClick={() => {
                setAddressForm({
                  fullName: '',
                  mobile: '',
                  houseNumber: '',
                  street: '',
                  area: '',
                  landmark: '',
                  city: '',
                  state: 'Delhi',
                  pincode: '',
                  addressType: 'home',
                  isDefaultShipping: addresses.length === 0,
                });
                setIsAddressModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-aesthique-espresso text-aesthique-ivory px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors"
            >
              <Plus className="w-4 h-4 text-aesthique-gold" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr, idx) => (
              <div
                key={addr.id || idx}
                className="bg-white border border-aesthique-beige p-5 space-y-3 relative shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 border-b border-aesthique-beige/50 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-aesthique-espresso uppercase tracking-wider">
                      {addr.addressType || 'Home'}
                    </span>
                    {addr.isDefaultShipping && (
                      <span className="px-2 py-0.5 bg-aesthique-gold/20 text-aesthique-copper text-[10px] uppercase font-bold tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-aesthique-espresso/40 hover:text-rose-700 transition-colors p-1"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-aesthique-espresso/80 space-y-1">
                  <p className="font-semibold text-aesthique-espresso">{addr.fullName}</p>
                  <p>{addr.houseNumber}, {addr.street}</p>
                  {addr.area && <p>{addr.area}</p>}
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p>Mobile: {addr.mobile}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white border border-aesthique-beige p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-editorial text-xl font-bold text-aesthique-espresso border-b border-aesthique-beige pb-3">
            Personal Profile Information
          </h3>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, firstName: e.target.value })
                  }
                  className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                />
              </div>

              <div>
                <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, lastName: e.target.value })
                  }
                  className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full bg-aesthique-beige/40 border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso/60 cursor-not-allowed"
              />
              <p className="text-[10px] text-aesthique-espresso/50 mt-1">
                Contact concierge to update your registered email address.
              </p>
            </div>

            <div>
              <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength={10}
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    phone: e.target.value.replace(/\D/g, ''),
                  })
                }
                className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
              />
            </div>

            <Button type="submit" variant="primary" size="md">
              Save Profile Changes
            </Button>
          </form>
        </div>
      )}

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-aesthique-beige w-full max-w-lg p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-aesthique-beige">
              <h3 className="font-editorial text-lg font-bold text-aesthique-espresso">
                Add Shipping Address
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1 text-aesthique-espresso/60 hover:text-aesthique-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addressError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{addressError}</span>
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, fullName: e.target.value })
                    }
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={addressForm.mobile}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        mobile: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Flat / House No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.houseNumber}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, houseNumber: e.target.value })
                    }
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    Street / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, street: e.target.value })
                    }
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>

                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    State *
                  </label>
                  <select
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  >
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        pincode: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    className="w-full bg-aesthique-ivory border border-aesthique-beige p-2.5 text-xs text-aesthique-espresso tracking-widest focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultCheck"
                  checked={addressForm.isDefaultShipping}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefaultShipping: e.target.checked,
                    })
                  }
                  className="accent-aesthique-copper w-4 h-4"
                />
                <label
                  htmlFor="defaultCheck"
                  className="text-xs uppercase tracking-wider text-aesthique-espresso font-medium cursor-pointer"
                >
                  Make primary default shipping address
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddressModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={addressLoading}
                >
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
