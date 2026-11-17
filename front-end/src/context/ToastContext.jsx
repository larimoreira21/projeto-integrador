import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remover = useCallback((id) => {
    setToasts((lista) => lista.filter((item) => item.id !== id));
  }, []);

  const notificar = useCallback((mensagem, tipo = 'sucesso') => {
    const id = crypto.randomUUID();
    setToasts((lista) => [...lista, { id, mensagem, tipo }]);
    window.setTimeout(() => remover(id), 4500);
  }, [remover]);

  const valor = useMemo(() => ({ notificar }), [notificar]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[80] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
        {toasts.map((toast) => {
          const erro = toast.tipo === 'erro';
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-card ${
                erro
                  ? 'border-rose-200 bg-rose-50 text-rose-900'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-950'
              }`}
            >
              {erro ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
              <p className="flex-1">{toast.mensagem}</p>
              <button type="button" className="rounded p-0.5" onClick={() => remover(toast.id)} aria-label="Fechar aviso">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) {
    throw new Error('useToast deve ser usado dentro de ToastProvider.');
  }
  return contexto;
}
