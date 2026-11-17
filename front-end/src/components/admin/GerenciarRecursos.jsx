import { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import api, { errosCampos, mensagemErro } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import useLista from '../../hooks/useLista';
import { Spinner } from '../Spinner';

const VAZIO = {
  titulo: '',
  tipo: 'guia',
  categoria: '',
  descricao: '',
  url_conteudo: '',
};

export default function GerenciarRecursos({ pedirExclusao }) {
  const { notificar } = useToast();
  const { itens, carregando, recarregar } = useLista('/recursos');
  const [form, setForm] = useState(null);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo) => (evento) => setForm((atual) => ({ ...atual, [campo]: evento.target.value }));

  const salvar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setErros({});
    const payload = {
      titulo: form.titulo,
      tipo: form.tipo,
      categoria: form.categoria,
      descricao: form.descricao,
      url_conteudo: form.url_conteudo,
    };
    try {
      const resposta = form.id
        ? await api.put(`/recursos/${form.id}`, payload)
        : await api.post('/recursos', payload);
      notificar(resposta.data.message);
      setForm(null);
      recarregar();
    } catch (error) {
      setErros(errosCampos(error));
      notificar(mensagemErro(error), 'erro');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" className="btn btn-solid" onClick={() => { setErros({}); setForm(VAZIO); }}>
          <Plus className="h-4 w-4" />
          Novo recurso
        </button>
      </div>
      {carregando ? (
        <div className="flex justify-center py-16"><Spinner className="h-8 w-8 text-forest-800" /></div>
      ) : (
        <div className="space-y-3">
          {itens.length === 0 && <p className="card px-5 py-8 text-center text-sm text-slate-600">Nenhum recurso cadastrado.</p>}
          {itens.map((item) => (
            <article key={item.id} className="card flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">{item.tipo} · {item.categoria}</p>
                <h2 className="font-bold text-forest-900">{item.titulo}</h2>
              </div>
              <div className="flex gap-3">
                <button type="button" className="btn btn-outline" onClick={() => { setErros({}); setForm(item); }}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </button>
                <button
                  type="button"
                  className="btn bg-rose-50 text-rose-800 hover:bg-rose-100"
                  onClick={() => pedirExclusao({
                    titulo: 'Excluir recurso',
                    mensagem: `Excluir "${item.titulo}"?`,
                    url: `/recursos/${item.id}`,
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

      {form && (
        <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-forest-950/50 p-4">
          <form className="my-8 w-full max-w-lg rounded-2xl bg-white p-6" onSubmit={salvar}>
            <h2 className="text-lg font-extrabold text-forest-900">{form.id ? 'Editar recurso' : 'Novo recurso'}</h2>
            <div className="mt-4 grid gap-3">
              <label>
                <span className="label">Título</span>
                <input className="field" required maxLength={180} value={form.titulo} onChange={alterar('titulo')} />
                {erros.titulo && <span className="mt-1 block text-xs text-rose-700">{erros.titulo[0]}</span>}
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="label">Tipo</span>
                  <select className="field" value={form.tipo} onChange={alterar('tipo')}>
                    <option value="guia">Guia</option>
                    <option value="video">Vídeo</option>
                  </select>
                </label>
                <label>
                  <span className="label">Categoria</span>
                  <input className="field" required maxLength={80} value={form.categoria} onChange={alterar('categoria')} placeholder="Energia" />
                  {erros.categoria && <span className="mt-1 block text-xs text-rose-700">{erros.categoria[0]}</span>}
                </label>
              </div>
              <label>
                <span className="label">Descrição</span>
                <textarea className="field min-h-24" required value={form.descricao} onChange={alterar('descricao')} />
                {erros.descricao && <span className="mt-1 block text-xs text-rose-700">{erros.descricao[0]}</span>}
              </label>
              <label>
                <span className="label">URL do conteúdo</span>
                <input className="field" required type="url" maxLength={255} value={form.url_conteudo} onChange={alterar('url_conteudo')} />
                {erros.url_conteudo && <span className="mt-1 block text-xs text-rose-700">{erros.url_conteudo[0]}</span>}
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="btn btn-outline" disabled={enviando} onClick={() => setForm(null)}>Cancelar</button>
              <button type="submit" className="btn btn-solid" disabled={enviando}>
                {enviando && <Spinner className="h-4 w-4" />}
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
