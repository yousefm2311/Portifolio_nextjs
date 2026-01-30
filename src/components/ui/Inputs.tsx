import { cn } from '@/lib/utils';
import React from 'react';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-accent-400 focus:outline-none',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-accent-400 focus:outline-none',
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white focus:border-accent-400 focus:outline-none',
        className
      )}
      {...props}
    />
  );
}
