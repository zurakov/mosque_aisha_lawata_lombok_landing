// Root layout — the real <html>/<body> shell lives in app/[locale]/layout.tsx
// (next-intl locale-prefixed routing). This wrapper just passes children
// through so non-localized routes (e.g. not-found) still render.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
