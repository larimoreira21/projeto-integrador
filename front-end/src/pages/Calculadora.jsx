import { useState } from 'react';
import { Leaf } from 'lucide-react';
import api, { errosCampos, mensagemErro } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/Spinner';

const TRANSPORTE = [
  { valor: 'carro_combustao', rotulo: 'Carro a combustão' },
  { valor: 'moto', rotulo: 'Moto' },
  { valor: 'transporte_publico', rotulo: 'Transporte público' },
  { valor: 'bicicleta_caminhada', rotulo: 'Bicicleta ou caminhada' },
];

const RECICLA = [
  { valor: 'sempre', rotulo: 'Sempre separo os recicláveis' },
  { valor: 'as_vezes', rotulo: 'Às vezes' },
  { valor: 'nunca', rotulo: 'Nunca' },
];

const CORES = {
  baixo: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  moderado: 'bg-amber-50 text-amber-950 border-amber-200',
  alto: 'bg-rose-50 text-rose-950 border-rose-200',
};

const ROTULOS = { baixo: 'Baixo', moderado: 'Moderado', alto: 'Alto' };

const INICIAL = {
  transporte_principal: 'carro_combustao',
  km_semanais: '',
  kwh_mensal: '',
  recicla_residuos: 'as_vezes',
};

export default function Calculadora() {
  const { notificar } = useToast();
  const [form, setForm] = useState(INICIAL);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const alterar = (campo) => (evento) => setForm((atual) => ({ ...atual, [campo]: evento.target.value }));

  const calcular = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setErros({});
    try {
      const { data } = await api.post('/calculadora-pegada', {
        transporte_principal: form.transporte_principal,
        km_semanais: Number(form.km_semanais),
        kwh_mensal: Number(form.kwh_mensal),
        recicla_residuos: form.recicla_residuos,
      });
      setResultado(data.data);
      notificar(data.message);
    } catch (error) {
      setErros(errosCampos(error));
      notificar(mensagemErro(error), 'erro');
    } finally {
      setEnviando(false);
    }
  };

  const nivel = resultado?.nivel_impacto;
  const barra = resultado ? Math.min(100, (Number(resultado.emissao_anual_kg) / 5000) * 100) : 0;

  return (
    <section className="bg-mist py-12">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="card p-6" onSubmit={calcular}>
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">Pegada de carbono</p>
          <h1 className="mt-1 text-3xl font-extrabold text-forest-900">Calculadora interativa</h1>
          <p className="mt-2 text-sm text-slate-600">
            Informe o deslocamento, a energia de casa e o hábito de reciclagem. O cálculo anual é feito pela API.
          </p>

          <fieldset className="mt-6">
            <legend className="label">Meio de transporte principal</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {TRANSPORTE.map((item) => (
                <label key={item.valor} className={`cursor-pointer rounded-xl border px-3 py-3 text-sm ${form.transporte_principal === item.valor ? 'border-forest-700 bg-mist font-semibold text-forest-900' : 'border-slate-200'}`}>
                  <input className="mr-2 accent-forest-800" type="radio" name="transporte" value={item.valor} checked={form.transporte_principal === item.valor} onChange={alterar('transporte_principal')} />
                  {item.rotulo}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label>
              <span className="label">Quilômetros por semana</span>
              <input className="field" required type="number" min="0" max="10000" step="0.01" value={form.km_semanais} onChange={alterar('km_semanais')} placeholder="120" />
              {erros.km_semanais && <span className="mt-1 block text-xs text-rose-700">{erros.km_semanais[0]}</span>}
            </label>
            <label>
              <span className="label">Energia no mês (kWh)</span>
              <input className="field" required type="number" min="0" max="50000" step="0.01" value={form.kwh_mensal} onChange={alterar('kwh_mensal')} placeholder="210" />
              {erros.kwh_mensal && <span className="mt-1 block text-xs text-rose-700">{erros.kwh_mensal[0]}</span>}
            </label>
          </div>

          <fieldset className="mt-4">
            <legend className="label">Com que frequência você recicla?</legend>
            <div className="flex flex-col gap-2">
              {RECICLA.map((item) => (
                <label key={item.valor} className={`cursor-pointer rounded-xl border px-3 py-3 text-sm ${form.recicla_residuos === item.valor ? 'border-forest-700 bg-mist font-semibold text-forest-900' : 'border-slate-200'}`}>
                  <input className="mr-2 accent-forest-800" type="radio" name="recicla" value={item.valor} checked={form.recicla_residuos === item.valor} onChange={alterar('recicla_residuos')} />
                  {item.rotulo}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="btn btn-solid mt-6" disabled={enviando}>
            {enviando && <Spinner className="h-4 w-4" />}
            Calcular pegada
          </button>
        </form>

        <aside className="card p-6">
          {!resultado && (
            <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <Leaf className="h-10 w-10 text-forest-700" />
              <p className="mt-3 max-w-xs text-sm text-slate-600">
                O resultado aparece aqui: quilos de CO₂ por ano, o nível de impacto e recomendações para o seu perfil.
              </p>
            </div>
          )}
          {resultado && (
            <div>
              <p className="text-sm font-semibold text-forest-700">Emissão anual estimada</p>
              <p className="mt-1 text-4xl font-extrabold text-forest-900">
                {Number(resultado.emissao_anual_kg).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="ml-2 text-base font-semibold text-slate-500">kg de CO₂</span>
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-forest-700" style={{ width: `${barra}%` }} />
              </div>
              <p className={`mt-4 inline-flex rounded-full border px-3 py-1 text-sm font-bold ${CORES[nivel]}`}>
                Impacto {ROTULOS[nivel] || nivel}
              </p>
              <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                <Detalhe rotulo="Transporte" valor={resultado.detalhamento.transporte_kg} />
                <Detalhe rotulo="Energia" valor={resultado.detalhamento.energia_kg} />
                <Detalhe rotulo="Resíduos" valor={resultado.detalhamento.residuos_kg} />
              </dl>
              <h2 className="mt-6 font-bold text-forest-900">Recomendações</h2>
              <ul className="mt-2 space-y-2">
                {resultado.recomendacoes.map((dica) => (
                  <li key={dica} className="rounded-xl bg-mist px-3 py-2 text-sm leading-relaxed text-slate-700">{dica}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function Detalhe({ rotulo, valor }) {
  return (
    <div className="rounded-xl bg-mist px-2 py-3">
      <dt className="text-xs text-slate-500">{rotulo}</dt>
      <dd className="mt-1 text-sm font-bold text-forest-900">
        {Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
      </dd>
    </div>
  );
}
