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
        variant === 'primary' &&
          'bg-gradient-to-br from-accent-500 to-accent-400 text-ink-900 shadow-glow hover:from-accent-400 hover:to-accent-300',
        variant === 'secondary' &&
          'border border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10',
        variant === 'ghost' && 'border border-white/10 text-white/80 hover:bg-white/5 hover:text-white',
        className
      )}
      {...props}
    />
  );
}
