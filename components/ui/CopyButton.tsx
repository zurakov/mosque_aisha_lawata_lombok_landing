'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Copy-to-clipboard button with an inline "Copied!" confirmation.
 * Labels are passed in (translated) by the caller — no hardcoded strings.
 */
export function CopyButton({
  value,
  copyLabel,
  copiedLabel,
  className,
}: {
  value: string;
  copyLabel: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (non-secure context) — fail quietly.
    }
  };

  return (
    <button
      onClick={onCopy}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent',
        copied && 'border-accent text-accent-dark',
        className,
      )}
      aria-live="polite"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}
