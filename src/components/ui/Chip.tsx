import { cn } from '@/lib/utils';

export default function Chip({
  label,
  active = false,
  onClick
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-1.5 text-xs font-semibold transition',
        active
          ? 'border-accent-400 bg-accent-400/15 text-white'
          : 'border-white/10 text-white/70 hover:border-white/30'
      )}
    >
      {label}
    </button>
  );
}
