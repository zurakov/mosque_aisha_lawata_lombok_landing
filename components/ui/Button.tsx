import { cn } from '@/lib/utils';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'heroOutline';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  accent: 'bg-accent text-primary-dark hover:bg-accent-dark',
  outline:
    'border border-primary/30 text-primary hover:bg-primary hover:text-white',
  ghost: 'text-primary hover:bg-primary/5',
  // Transparent outline for use over the hero. On hover it becomes a solid
  // cream surface with NAVY text (never white-on-white) — always readable.
  heroOutline:
    'border border-white/60 bg-white/5 text-white hover:bg-background hover:text-primary hover:border-background',
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      {children}
    </a>
  );
}
