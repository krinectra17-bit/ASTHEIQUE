'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = await signIn(formData);
    setIsLoading(false);

    if (result.success) {
      setSuccess('Authenticated successfully! Redirecting...');
      // Sync local storage session indicator
      localStorage.setItem(
        'aesthique_customer_session',
        JSON.stringify({
          email,
          fullName: email.split('@')[0],
          isLoggedIn: true,
        })
      );
      setTimeout(() => {
        router.push('/account');
        router.refresh();
      }, 1000);
    } else {
      // If Supabase returns an error, show it clearly
      setError(result.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-aesthique-cream">
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
            Patron Sign In
          </h1>
          <p className="text-xs text-aesthique-espresso/70">
            Access your orders, saved addresses and curated wishlist.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="patron@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-aesthique-ivory border border-aesthique-beige p-3 text-xs text-aesthique-espresso focus:outline-none focus:border-aesthique-gold pl-9"
              />
              <Mail className="w-4 h-4 text-aesthique-copper absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-aesthique-espresso/70 uppercase tracking-wider font-medium">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-aesthique-copper hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 text-aesthique-gold" />
          </Button>
        </form>

        <div className="pt-4 border-t border-aesthique-beige text-center text-xs text-aesthique-espresso/70">
          <span>New to AESTHIQUE? </span>
          <Link
            href="/auth/register"
            className="text-aesthique-copper font-semibold uppercase tracking-wider hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
