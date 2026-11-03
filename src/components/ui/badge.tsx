import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'espresso' | 'neutral' | 'sale' | 'success';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase font-semibold tracking-widest rounded-none';

  const variants = {
    gold: 'bg-aesthique-gold/15 text-aesthique-copper border border-aesthique-gold/30',
    espresso: 'bg-aesthique-espresso text-aesthique-ivory',
    neutral: 'bg-aesthique-beige/60 text-aesthique-espresso/80',
    sale: 'bg-amber-800 text-white',
    success: 'bg-emerald-800 text-white',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
