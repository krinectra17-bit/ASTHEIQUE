'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginAdminAction } from '@/app/admin/actions';
import { Shield, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export function AdminLoginCard() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the administrative password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await loginAdminAction(password);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error || 'Authentication failed. Please verify your administrative credentials.');
      }
    } catch {
      setError('An error occurred during authentication. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1612] flex items-center justify-center p-4 sm:p-6 text-aesthique-espresso">
      {/* Editorial Luxury Container */}
      <div className="w-full max-w-md bg-[#FAF7F2] border border-[#C99A68]/30 shadow-2xl relative overflow-hidden">
        {/* Subtle Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-aesthique-gold via-aesthique-copper to-aesthique-gold" />

        <div className="p-8 sm:p-10 space-y-8">
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto relative w-12 h-12 rounded-full overflow-hidden border border-aesthique-gold shadow-sm flex items-center justify-center bg-white">
              <Image
                src="/brand/aesthique-logo.png"
                alt="AESTHIQUE"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div>
              <span className="font-editorial text-2xl font-bold tracking-widest text-aesthique-espresso block">
                AESTHIQUE
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-aesthique-copper font-semibold block mt-1">
                Management Console
              </span>
            </div>
            <p className="text-xs text-aesthique-espresso/60 max-w-xs mx-auto leading-relaxed">
              Restricted portal for authorized administrators. Enter your secure management credentials to continue.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-sm flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="admin-password"
                className="text-[11px] font-semibold text-aesthique-espresso uppercase tracking-wider block"
              >
                Administrative Security Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-aesthique-espresso/40">
                  <Lock className="w-4 h-4 text-aesthique-gold" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  className="w-full pl-9 pr-10 py-3 bg-white border border-aesthique-beige text-xs text-aesthique-espresso placeholder:text-aesthique-espresso/35 focus:outline-none focus:border-aesthique-gold transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-aesthique-espresso/40 hover:text-aesthique-espresso transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-aesthique-espresso text-aesthique-ivory py-3 px-4 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-aesthique-gold" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-3.5 h-3.5 text-aesthique-gold group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security & Cryptography Assurance Footer */}
          <div className="pt-4 border-t border-aesthique-beige/60 flex items-center justify-between text-[10px] text-aesthique-espresso/50">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>HMAC-SHA256 Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-aesthique-copper" />
              <span>Brute-Force Guard Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
