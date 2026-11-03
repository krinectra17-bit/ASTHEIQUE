'use client';

import React from 'react';
import { useStore } from '@/context/store-context';
import { CheckCircle2 } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-aesthique-espresso text-aesthique-ivory px-5 py-3.5 shadow-2xl border border-aesthique-gold/30 animate-slide-up">
      <CheckCircle2 className="w-4 h-4 text-aesthique-gold flex-shrink-0" />
      <span className="text-xs uppercase tracking-wider font-medium">{toastMessage}</span>
    </div>
  );
};
