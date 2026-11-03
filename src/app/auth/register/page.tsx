'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.setItem(
        'aesthique_customer_session',
        JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          isLoggedIn: true,
        })
      );
      router.push('/account');
    } catch {
      setError('Unable to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-aesthique-cream">
      <div className="w-full max-w-md bg-white border border-aesthique-beige p-8 shadow-luxury space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-12 h-12 mx-auto">
            <Image
              src="/brand/aesthique-logo.png"
              alt="AESTHIQUE"
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
          <h1 className="font-editorial text-2xl font-bold text-aesthique-espresso">
            Join AESTHIQUE
          </h1>
          <p className="text-xs text-aesthique-espresso/70">
            Create an account for personalized curation, seamless checkout and order tracking.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Ananya Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-aesthique-ivory border border-aesthique-beige p-3 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold pl-9"
              />
              <User className="w-4 h-4 text-aesthique-copper absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="patron@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-aesthique-ivory border border-aesthique-beige p-3 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold pl-9"
              />
              <Mail className="w-4 h-4 text-aesthique-copper absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
              Mobile Number (+91)
            </label>
            <div className="relative">
              <input
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })
                }
                className="w-full bg-aesthique-ivory border border-aesthique-beige p-3 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold pl-9"
              />
              <Phone className="w-4 h-4 text-aesthique-copper absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
              Password (min. 8 characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-aesthique-ivory border border-aesthique-beige p-3 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold pl-9"
              />
              <Lock className="w-4 h-4 text-aesthique-copper absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full bg-aesthique-ivory border border-aesthique-beige p-3 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold pl-9"
              />
              <Lock className="w-4 h-4 text-aesthique-copper absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4 text-aesthique-gold" />
          </Button>
        </form>

        <div className="pt-4 border-t border-aesthique-beige text-center text-xs text-aesthique-espresso/70">
          <span>Already registered with AESTHIQUE? </span>
          <Link
            href="/auth/login"
            className="text-aesthique-copper font-semibold uppercase tracking-wider hover:underline"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
