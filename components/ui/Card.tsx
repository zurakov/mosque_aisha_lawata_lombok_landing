import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-primary/10 bg-white p-6 shadow-card',
        className,
      )}
    >
      {children}
    </div>
  );
}
