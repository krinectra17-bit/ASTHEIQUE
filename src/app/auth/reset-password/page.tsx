'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('password', password);

    const result = await updatePassword(formData);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to update password.');
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/account');
      }, 2000);
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
            Set New Password
          </h1>
          <p className="text-xs text-aesthique-espresso/70">
            Please create a secure password for your AESTHIQUE patron account.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>Password successfully updated! Redirecting to account...</span>
            </div>
            <Link href="/account">
              <Button variant="primary" size="sm" className="w-full">
                Go to Account Now
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                New Password (min. 8 characters)
              </label>
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

            <div>
              <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="w-full"
            >
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
