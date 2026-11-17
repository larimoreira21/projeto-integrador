import { useEffect, useState } from 'react';
import { Clock, MapPin, Search } from 'lucide-react';
import api, { mensagemErro } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonCards } from '../components/Spinner';

export default function PontosColeta() {
  const { notificar } = useToast();
  const [categorias, setCategorias] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [busca, setBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('/categorias-residuos')
      .then(({ data }) => setCategorias(data.data))
      .catch((error) => notificar(mensagemErro(error), 'erro'));
  }, [notificar]);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    const params = {};
    if (categoriaId) params.categoria_residuo_id = categoriaId;
    if (buscaAplicada) params.busca = buscaAplicada;
    api.get('/pontos-coleta', { params })
      .then(({ data }) => {
        if (ativo) setPontos(data.data);
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
  }, [categoriaId, buscaAplicada, notificar]);

  return (
    <section className="bg-mist py-12">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">Ecopontos</p>
        <h1 className="mt-1 text-3xl font-extrabold text-forest-900">Pontos de coleta</h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          Encontre onde descartar recicláveis, eletrônicos, óleo, pilhas e orgânicos. Os endereços vêm da base comunitária.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" className={`rounded-full px-3 py-1.5 text-sm font-semibold ${categoriaId === '' ? 'bg-forest-800 text-white' : 'bg-white text-forest-800'}`} onClick={() => setCategoriaId('')}>
            Todos
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${String(categoriaId) === String(categoria.id) ? 'text-white' : 'bg-white text-forest-900'}`}
              style={String(categoriaId) === String(categoria.id) ? { backgroundColor: categoria.cor_badge } : undefined}
              onClick={() => setCategoriaId(String(categoria.id))}
            >
              {categoria.nome}
            </button>
          ))}
        </div>

        <form
          className="mt-4 flex max-w-lg gap-2"
          onSubmit={(evento) => {
            evento.preventDefault();
            setBuscaAplicada(busca.trim());
          }}
        >
          <label className="relative flex-1">
            <span className="sr-only">Buscar por bairro</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="field pl-9" value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder="Buscar por bairro, endereço ou nome do local" />
          </label>
          <button type="submit" className="btn btn-outline">Buscar</button>
        </form>

        <div className="mt-8">
          {carregando && <SkeletonCards />}
          {!carregando && pontos.length === 0 && (
            <p className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-slate-600">
              Nenhum ecoponto encontrado para esse filtro. Tente outro tipo de resíduo ou outro bairro.
            </p>
          )}
          {!carregando && pontos.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {pontos.map((ponto) => (
                <article key={ponto.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-bold text-forest-900">{ponto.nome_local}</h2>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: ponto.categoria_residuo?.cor_badge || '#1E5631' }}
                    >
                      {ponto.categoria_residuo?.nome || 'Resíduo'}
                    </span>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" />
                    {ponto.endereco} — {ponto.bairro}, {ponto.cidade}
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" />
                    {ponto.horario_funcionamento}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
