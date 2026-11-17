import { useEffect, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import api, { errosCampos, mensagemErro } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import useLista from '../../hooks/useLista';
import { Spinner } from '../Spinner';

const VAZIO = {
  categoria_residuo_id: '',
  nome_local: '',
  endereco: '',
  bairro: '',
  cidade: '',
  horario_funcionamento: '',
  aprovado: true,
};

export default function GerenciarPontos({ pedirExclusao }) {
  const { notificar } = useToast();
  const { itens, carregando, recarregar } = useLista('/pontos-coleta');
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(null);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api.get('/categorias-residuos').then(({ data }) => setCategorias(data.data)).catch(() => {});
  }, []);

  const alterar = (campo) => (evento) => {
    const valor = evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value;
    setForm((atual) => ({ ...atual, [campo]: valor }));
  };

  const salvar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setErros({});
    const payload = {
      categoria_residuo_id: Number(form.categoria_residuo_id),
      nome_local: form.nome_local,
      endereco: form.endereco,
      bairro: form.bairro,
      cidade: form.cidade,
      horario_funcionamento: form.horario_funcionamento,
      ...(form.id ? { aprovado: Boolean(form.aprovado) } : {}),
    };
    try {
      const resposta = form.id
        ? await api.put(`/pontos-coleta/${form.id}`, payload)
        : await api.post('/pontos-coleta', payload);
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
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">A lista pública mostra somente pontos aprovados.</p>
        <button type="button" className="btn btn-solid" onClick={() => { setErros({}); setForm(VAZIO); }}>
          <Plus className="h-4 w-4" />
          Novo ponto
        </button>
      </div>
      {carregando ? (
        <div className="flex justify-center py-16"><Spinner className="h-8 w-8 text-forest-800" /></div>
      ) : (
        <div className="space-y-3">
          {itens.length === 0 && <p className="card px-5 py-8 text-center text-sm text-slate-600">Nenhum ponto aprovado.</p>}
          {itens.map((ponto) => (
            <article key={ponto.id} className="card flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-forest-900">{ponto.nome_local}</h2>
                <p className="text-sm text-slate-600">{ponto.endereco} — {ponto.bairro}</p>
                <p className="text-xs text-slate-500">{ponto.categoria_residuo?.nome} · {ponto.horario_funcionamento}</p>
              </div>
              <div className="flex gap-3">
                <button type="button" className="btn btn-outline" onClick={() => { setErros({}); setForm({ ...ponto, categoria_residuo_id: ponto.categoria_residuo_id }); }}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </button>
                <button
                  type="button"
                  className="btn bg-rose-50 text-rose-800 hover:bg-rose-100"
                  onClick={() => pedirExclusao({
                    titulo: 'Excluir ecoponto',
                    mensagem: `Excluir "${ponto.nome_local}"? O endereço sai do site imediatamente.`,
                    url: `/pontos-coleta/${ponto.id}`,
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
            <h2 className="text-lg font-extrabold text-forest-900">{form.id ? 'Editar ponto' : 'Novo ponto'}</h2>
            <div className="mt-4 grid gap-3">
              <label>
                <span className="label">Tipo de resíduo</span>
                <select className="field" required value={String(form.categoria_residuo_id)} onChange={alterar('categoria_residuo_id')}>
                  <option value="">Selecione</option>
                  {categorias.map((categoria) => <option key={categoria.id} value={String(categoria.id)}>{categoria.nome}</option>)}
                </select>
              </label>
              <Campo rotulo="Nome do local" valor={form.nome_local} onChange={alterar('nome_local')} erro={erros.nome_local} />
              <Campo rotulo="Endereço" valor={form.endereco} onChange={alterar('endereco')} erro={erros.endereco} />
              <Campo rotulo="Bairro" valor={form.bairro} onChange={alterar('bairro')} erro={erros.bairro} />
              <Campo rotulo="Cidade" valor={form.cidade} onChange={alterar('cidade')} erro={erros.cidade} />
              <Campo rotulo="Horário" valor={form.horario_funcionamento} onChange={alterar('horario_funcionamento')} erro={erros.horario_funcionamento} />
              {form.id && (
                <label className="flex items-center gap-2 text-sm font-semibold text-forest-900">
                  <input type="checkbox" checked={Boolean(form.aprovado)} onChange={alterar('aprovado')} />
                  Aprovado e visível no site
                </label>
              )}
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

function Campo({ rotulo, valor, onChange, erro }) {
  return (
    <label>
      <span className="label">{rotulo}</span>
      <input className="field" required value={valor || ''} onChange={onChange} />
      {erro && <span className="mt-1 block text-xs text-rose-700">{erro[0]}</span>}
    </label>
  );
}
