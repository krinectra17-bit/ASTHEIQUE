import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-none';

    const variants = {
      primary:
        'bg-aesthique-espresso text-aesthique-ivory hover:bg-black focus:ring-aesthique-gold shadow-sm hover:shadow-md',
      secondary:
        'bg-aesthique-beige text-aesthique-espresso hover:bg-[#DDD0C1] focus:ring-aesthique-espresso',
      outline:
        'border border-aesthique-espresso text-aesthique-espresso hover:bg-aesthique-espresso hover:text-aesthique-ivory focus:ring-aesthique-gold',
      gold:
        'bg-aesthique-gold text-white hover:bg-aesthique-copper focus:ring-aesthique-gold shadow-md hover:shadow-gold-glow',
      ghost:
        'text-aesthique-espresso hover:bg-aesthique-beige/40 focus:ring-aesthique-gold',
      danger:
        'bg-rose-700 text-white hover:bg-rose-800 focus:ring-rose-500',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 uppercase tracking-wider',
      md: 'text-sm px-6 py-3 uppercase tracking-wider',
      lg: 'text-base px-8 py-4 uppercase tracking-widest',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
