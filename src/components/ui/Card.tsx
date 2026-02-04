import { cn } from '@/lib/utils';

export default function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('glass rounded-2xl p-6 shadow-card transition', className)}>
      {children}
    </div>
  );
}
