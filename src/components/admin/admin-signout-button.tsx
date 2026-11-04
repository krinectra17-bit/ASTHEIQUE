'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAdminAction } from '@/app/admin/actions';
import { LogOut, Loader2 } from 'lucide-react';

export function AdminSignoutButton({ compact = false }: { compact?: boolean }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await logoutAdminAction();
      router.refresh();
      router.push('/admin');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsPending(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        title="Sign Out of Operations Console"
        className="p-1.5 text-aesthique-espresso/60 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-aesthique-gold" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-300 hover:text-white hover:bg-red-950/40 rounded-sm transition-all"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-aesthique-gold" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>Sign Out</span>
    </button>
  );
}
