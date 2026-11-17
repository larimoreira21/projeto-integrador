import { useEffect } from 'react';
import { Spinner } from './Spinner';

export default function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  confirmarTexto = 'Excluir',
  carregando = false,
  onConfirmar,
  onCancelar,
}) {
  useEffect(() => {
    if (!aberto) return undefined;
    const aoTeclar = (evento) => {
      if (evento.key === 'Escape' && !carregando) onCancelar();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aberto, carregando, onCancelar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-forest-950/50 p-4" role="presentation" onClick={carregando ? undefined : onCancelar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-titulo"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h2 id="confirm-titulo" className="text-lg font-bold text-forest-900">{titulo}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{mensagem}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-outline" onClick={onCancelar} disabled={carregando}>
            Cancelar
          </button>
          <button type="button" className="btn bg-rose-700 text-white hover:bg-rose-800" onClick={onConfirmar} disabled={carregando}>
            {carregando && <Spinner className="h-4 w-4" />}
            {confirmarTexto}
          </button>
        </div>
      </div>
    </div>
  );
}
