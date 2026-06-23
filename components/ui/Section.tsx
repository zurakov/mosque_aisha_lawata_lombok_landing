import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Container } from './Container';

/** A page section with an anchor id and consistent vertical rhythm. */
export function Section({
  id,
  children,
  className,
  containerClassName,
  muted = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  muted?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-24 py-16 sm:py-24',
        muted && 'bg-surface',
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
