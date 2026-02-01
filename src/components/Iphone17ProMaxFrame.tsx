import { cn } from '@/lib/utils';

export default function Iphone17ProMaxFrame({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative mx-auto w-full max-w-sm', className)}>
      <div className="relative rounded-[2.9rem] bg-gradient-to-br from-[#2b3036] via-[#0f1216] to-[#1d2228] p-[10px] shadow-[0_35px_90px_rgba(4,12,24,0.6)]">
        <div className="absolute inset-[7px] rounded-[2.65rem] border border-white/10" />
        <div className="absolute inset-[11px] rounded-[2.45rem] border border-white/5" />

        <div className="relative rounded-[2.55rem] bg-black p-[6px]">
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-[10px] z-10 h-[26px] w-[120px] -translate-x-1/2 rounded-[999px] bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />
          <div className="absolute left-1/2 top-[18px] z-10 h-[6px] w-[36px] -translate-x-1/2 rounded-full bg-white/10" />

          {/* Side buttons */}
          <div className="absolute left-2 top-24 h-16 w-1.5 rounded-full bg-white/12" />
          <div className="absolute left-2 top-46 h-9 w-1.5 rounded-full bg-white/12" />
          <div className="absolute right-2 top-28 h-14 w-1.5 rounded-full bg-white/12" />

          {/* Screen */}
          <div className="mt-8 overflow-hidden rounded-[2.25rem] border border-white/10 bg-surface-900">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
