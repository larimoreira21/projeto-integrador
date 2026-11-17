import { useEffect, useState } from 'react';
import { BookOpen, CircleHelp, Play, Search, Send } from 'lucide-react';
import api, { errosCampos, mensagemErro } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonCards, Spinner } from './Spinner';

const CARDS = [
  {
    id: 'guia',
    titulo: 'Guias e Cartilhas',
    texto: 'Materiais educativos sobre mitigação e conscientização climática.',
    acao: 'Acessar Materiais',
    icone: <BookOpen className="h-6 w-6" />,
    cor: 'bg-emerald-50 text-forest-700',
  },
  {
    id: 'video',
    titulo: 'Vídeos Educativos',
    texto: 'Vídeos curtos e didáticos para aprender onde estiver.',
    acao: 'Assistir Vídeos',
    icone: <Play className="h-6 w-6" />,
    cor: 'bg-sky-50 text-sky-600',
  },
  {
    id: 'faq',
    titulo: 'Perguntas Frequentes',
    texto: 'Tire dúvidas sobre o clima, ações práticas e mitigação.',
    acao: 'Ver Perguntas',
    icone: <CircleHelp className="h-6 w-6" />,
    cor: 'bg-violet-50 text-violet-600',
  },
];

const FORMULARIO_INICIAL = { autor_nome: '', pergunta: '' };

export default function RecursosEducativos({ painelInicial = null }) {
  const { notificar } = useToast();
  const [painel, setPainel] = useState(painelInicial);
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [duvidaAberta, setDuvidaAberta] = useState(false);
  const [duvida, setDuvida] = useState(FORMULARIO_INICIAL);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setPainel(painelInicial);
  }, [painelInicial]);

  useEffect(() => {
    if (!painel || painel === 'faq') return undefined;
    let ativo = true;
    setCarregando(true);
    const params = { tipo: painel };
    if (categoria) params.categoria = categoria;
    api.get('/recursos', { params })
      .then(({ data }) => {
        if (!ativo) return;
        setItens(data.data);
        if (!categoria) {
          setCategorias([...new Set(data.data.map((item) => item.categoria))]);
        }
      })
      .catch((error) => {
        if (ativo) notificar(mensagemErro(error), 'erro');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [painel, categoria, notificar]);

  useEffect(() => {
    if (painel !== 'faq') return undefined;
    let ativo = true;
    setCarregando(true);
    const params = {};
    if (buscaAplicada) params.busca = buscaAplicada;
    api.get('/faqs', { params })
      .then(({ data }) => {
        if (ativo) setItens(data.data);
      })
      .catch((error) => {
        if (ativo) notificar(mensagemErro(error), 'erro');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [painel, buscaAplicada, notificar]);

  const alternar = (id) => {
    setCategoria('');
    setBusca('');
    setBuscaAplicada('');
    setPainel((atual) => {
      const proximo = atual === id ? null : id;
      if (proximo) setCarregando(true);
      return proximo;
    });
  };

  const enviarDuvida = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setErros({});
    try {
      const { data } = await api.post('/faqs', {
        autor_nome: duvida.autor_nome.trim() || null,
        pergunta: duvida.pergunta.trim(),
      });
      notificar(data.message);
      setDuvida(FORMULARIO_INICIAL);
      setDuvidaAberta(false);
    } catch (error) {
      setErros(errosCampos(error));
      notificar(mensagemErro(error), 'erro');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="recursos" className="secao bg-mist py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-extrabold text-forest-900 md:text-3xl">Recursos Educativos</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CARDS.map((card) => {
            const ativo = painel === card.id;
            return (
              <article key={card.id} className={`card px-5 py-6 text-center ${ativo ? 'ring-2 ring-forest-700' : ''}`}>
                <div className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${card.cor}`}>
                  {card.icone}
                </div>
                <h3 className="mt-4 font-bold text-forest-900">{card.titulo}</h3>
                <p className="mt-2 min-h-12 text-sm leading-relaxed text-slate-600">{card.texto}</p>
                <button type="button" className="mt-4 text-sm font-semibold text-forest-800" aria-expanded={ativo} onClick={() => alternar(card.id)}>
                  {ativo ? 'Fechar' : `${card.acao} →`}
                </button>
              </article>
            );
          })}
        </div>

        {painel && painel !== 'faq' && (
          <div className="mt-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <h3 className="text-lg font-bold text-forest-900">
                {painel === 'guia' ? 'Guias e cartilhas' : 'Vídeos educativos'}
              </h3>
              <label className="text-sm">
                <span className="label">Categoria</span>
                <select className="field min-w-48" value={categoria} onChange={(evento) => { setCarregando(true); setCategoria(evento.target.value); }}>
                  <option value="">Todas</option>
                  {categorias.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            {carregando && <SkeletonCards />}
            {!carregando && itens.length === 0 && (
              <p className="rounded-2xl bg-white px-5 py-8 text-center text-sm text-slate-600">
                Nenhum material encontrado para esse filtro.
              </p>
            )}
            {!carregando && itens.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {itens.map((item) => (
                  <article key={item.id} className="card p-5">
                    <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-forest-800">{item.categoria}</span>
                    <h4 className="mt-3 font-bold text-forest-900">{item.titulo}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.descricao}</p>
                    <a href={item.url_conteudo} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-forest-800 hover:underline">
                      {item.tipo === 'video' ? 'Assistir' : 'Abrir material'}
                    </a>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {painel === 'faq' && (
          <div className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <form
                className="flex w-full max-w-md gap-2"
                onSubmit={(evento) => {
                  evento.preventDefault();
                  setBuscaAplicada(busca.trim());
                }}
              >
                <label className="flex-1">
                  <span className="label">Buscar nas perguntas</span>
                  <span className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input className="field pl-9" value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder="Ex.: energia, óleo, pilhas" />
                  </span>
                </label>
                <button type="submit" className="btn btn-solid">Buscar</button>
              </form>
              <button type="button" className="btn btn-outline" onClick={() => setDuvidaAberta(true)}>
                Envie sua dúvida
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {carregando && <SkeletonCards quantidade={2} />}
              {!carregando && itens.length === 0 && (
                <p className="rounded-2xl bg-white px-5 py-8 text-center text-sm text-slate-600">
                  Nenhuma pergunta publicada combina com essa busca.
                </p>
              )}
              {!carregando && itens.map((item) => (
                <article key={item.id} className="card p-5">
                  <h4 className="font-bold text-forest-900">{item.pergunta}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.resposta}</p>
                  {item.autor_nome && <p className="mt-3 text-xs text-slate-500">Enviada por {item.autor_nome}</p>}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {duvidaAberta && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-forest-950/50 p-4" onClick={() => !enviando && setDuvidaAberta(false)}>
          <form className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-card" onClick={(evento) => evento.stopPropagation()} onSubmit={enviarDuvida}>
            <h3 className="text-lg font-bold text-forest-900">Envie sua dúvida</h3>
            <p className="mt-1 text-sm text-slate-600">Ela fica pendente até um educador responder e publicar.</p>
            <label className="mt-4 block">
              <span className="label">Seu nome (opcional)</span>
              <input className="field" maxLength={120} value={duvida.autor_nome} onChange={(evento) => setDuvida({ ...duvida, autor_nome: evento.target.value })} />
              {erros.autor_nome && <span className="mt-1 block text-xs text-rose-700">{erros.autor_nome[0]}</span>}
            </label>
            <label className="mt-3 block">
              <span className="label">Pergunta</span>
              <textarea className="field min-h-28" required minLength={10} maxLength={1000} value={duvida.pergunta} onChange={(evento) => setDuvida({ ...duvida, pergunta: evento.target.value })} />
              {erros.pergunta && <span className="mt-1 block text-xs text-rose-700">{erros.pergunta[0]}</span>}
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="btn btn-outline" disabled={enviando} onClick={() => setDuvidaAberta(false)}>Cancelar</button>
              <button type="submit" className="btn btn-solid" disabled={enviando}>
                {enviando ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                Enviar
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
