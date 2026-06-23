'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { Check, X } from 'lucide-react';

type Toast = { id: number; message: string; kind: 'success' | 'error' };
type ToastCtx = { notify: (message: string, kind?: 'success' | 'error') => void };

const Ctx = createContext<ToastCtx>({ notify: () => {} });

export const useToast = () => useContext(Ctx);

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, kind: 'success' | 'error' = 'success') => {
    const id = ++counter;
    setToasts((t) => [...t, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-white shadow-lg ${
              t.kind === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {t.kind === 'success' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
