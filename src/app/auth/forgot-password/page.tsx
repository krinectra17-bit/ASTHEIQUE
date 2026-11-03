'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resetPassword } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('email', email);

    const result = await resetPassword(formData);
    setIsLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Failed to dispatch recovery link.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-aesthique-cream">
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
            Reset Password
          </h1>
          <p className="text-xs text-aesthique-espresso/70">
            Enter your registered email to receive secure recovery instructions.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>Password recovery link dispatched to {email}.</span>
            </div>
            <p className="text-xs text-aesthique-espresso/70">
              Please check your spam or promotions inbox if you do not see it within 2 minutes.
            </p>
            <div className="pt-2">
              <Link href="/auth/login">
                <Button variant="secondary" size="sm" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-aesthique-espresso/70 uppercase tracking-wider mb-1 font-medium">
                Registered Email
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

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full"
            >
              Send Recovery Instructions
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-aesthique-beige text-center">
          <Link
            href="/auth/login"
            className="text-xs text-aesthique-copper hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
