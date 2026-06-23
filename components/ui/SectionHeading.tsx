import { cn } from '@/lib/utils';

/** Centered display heading with an optional subtitle and gold rule. */
export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className,
}: {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-12 max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      <h2 className="font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
        {title}
      </h2>
      <span
        className={cn(
          'mt-4 block h-px w-16 bg-accent',
          align === 'center' && 'mx-auto',
        )}
        aria-hidden="true"
      />
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted">{subtitle}</p>
      )}
    </div>
  );
}
