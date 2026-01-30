import { cn } from '@/lib/utils';
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export default function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
        variant === 'primary' && 'bg-accent-500 text-white shadow-glow hover:bg-accent-400',
        variant === 'secondary' &&
          'border border-white/10 bg-white/5 text-white hover:bg-white/10',
        variant === 'ghost' && 'text-white/80 hover:text-white',
        className
      )}
      {...props}
    />
  );
}
