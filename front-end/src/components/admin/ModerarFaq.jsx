import { useMemo, useState } from 'react';
import api, { mensagemErro } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import useLista from '../../hooks/useLista';
import { Spinner } from '../Spinner';

export default function ModerarFaq({ pedirExclusao }) {
  const { notificar } = useToast();
  const { itens, carregando, recarregar } = useLista('/admin/faqs');
  const [filtro, setFiltro] = useState('todas');
  const [editando, setEditando] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const visiveis = useMemo(() => {
    if (filtro === 'todas') return itens;
    return itens.filter((item) => item.status === filtro);
  }, [itens, filtro]);

  const salvar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      const { data } = await api.put(`/admin/faqs/${editando.id}`, {
        pergunta: editando.pergunta,
        resposta: editando.resposta || null,
        status: editando.status,
      });
      notificar(data.message);
      setEditando(null);
      recarregar();
    } catch (error) {
      notificar(mensagemErro(error), 'erro');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {[
          ['todas', 'Todas'],
          ['pendente', 'Pendentes'],
          ['publicada', 'Publicadas'],
        ].map(([valor, rotulo]) => (
          <button key={valor} type="button" className={`rounded-full px-3 py-1.5 text-sm font-semibold ${filtro === valor ? 'bg-forest-800 text-white' : 'bg-white text-forest-900'}`} onClick={() => setFiltro(valor)}>
            {rotulo}
          </button>
        ))}
      </div>

      {carregando ? (
        <div className="flex justify-center py-16"><Spinner className="h-8 w-8 text-forest-800" /></div>
      ) : (
        <div className="space-y-3">
          {visiveis.length === 0 && (
            <p className="card px-5 py-8 text-center text-sm text-slate-600">Nenhuma dúvida nesse filtro.</p>
          )}
          {visiveis.map((item) => (
            <article key={item.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${item.status === 'publicada' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-950'}`}>
                  {item.status === 'publicada' ? 'Publicada' : 'Pendente'}
                </span>
                {item.autor_nome && <span className="text-xs text-slate-500">{item.autor_nome}</span>}
              </div>
              <h2 className="mt-2 font-bold text-forest-900">{item.pergunta}</h2>
              <p className="mt-1 text-sm text-slate-600">{item.resposta || 'Ainda sem resposta.'}</p>
              <div className="mt-3 flex gap-3">
                <button type="button" className="text-sm font-semibold text-forest-800" onClick={() => setEditando({ ...item, resposta: item.resposta || '' })}>
                  Responder
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-rose-700"
                  onClick={() => pedirExclusao({
                    titulo: 'Excluir pergunta',
                    mensagem: 'Excluir esta dúvida? Ela deixa de aparecer para a comunidade.',
                    url: `/admin/faqs/${item.id}`,
                    depois: recarregar,
                  })}
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editando && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-forest-950/50 p-4">
          <form className="w-full max-w-lg rounded-2xl bg-white p-6" onSubmit={salvar}>
            <h2 className="text-lg font-extrabold text-forest-900">Moderar dúvida</h2>
            <label className="mt-4 block">
              <span className="label">Pergunta</span>
              <textarea className="field min-h-20" required minLength={10} maxLength={1000} value={editando.pergunta} onChange={(evento) => setEditando({ ...editando, pergunta: evento.target.value })} />
            </label>
            <label className="mt-3 block">
              <span className="label">Resposta</span>
              <textarea className="field min-h-28" value={editando.resposta} onChange={(evento) => setEditando({ ...editando, resposta: evento.target.value })} />
            </label>
            <label className="mt-3 block">
              <span className="label">Status</span>
              <select className="field" value={editando.status} onChange={(evento) => setEditando({ ...editando, status: evento.target.value })}>
                <option value="pendente">Pendente</option>
                <option value="publicada">Publicada</option>
              </select>
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="btn btn-outline" disabled={enviando} onClick={() => setEditando(null)}>Cancelar</button>
              <button type="submit" className="btn btn-solid" disabled={enviando}>
                {enviando && <Spinner className="h-4 w-4" />}
                Salvar resposta
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
