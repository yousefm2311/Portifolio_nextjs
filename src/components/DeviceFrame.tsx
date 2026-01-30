import { cn } from '@/lib/utils';

export default function DeviceFrame({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative mx-auto w-full max-w-sm', className)}>
      <div className="relative rounded-[2.5rem] border border-white/20 bg-black/60 p-4 shadow-card">
        <div className="absolute left-1/2 top-3 h-1 w-16 -translate-x-1/2 rounded-full bg-white/20" />
        <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-white/10 bg-surface-900">
          {children}
        </div>
      </div>
    </div>
  );
}
