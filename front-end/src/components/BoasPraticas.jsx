import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike, Bus, Recycle, Sprout, Zap } from 'lucide-react';

const PRINCIPAIS = [
  {
    titulo: 'Reduza Emissões',
    texto: 'Opte por meios de transporte sustentáveis, como caminhada, bicicleta ou transporte público sempre que possível.',
    icone: (
      <span className="flex items-center gap-1 text-forest-700">
        <Bike className="h-7 w-7" />
        <Bus className="h-7 w-7" />
      </span>
    ),
  },
  {
    titulo: 'Poupe Energia',
    texto: 'Evite o desperdício: apague luzes, desligue aparelhos da tomada e utilize fontes de energia renováveis.',
    icone: <Zap className="h-8 w-8 text-forest-700" />,
  },
  {
    titulo: 'Plante Árvores',
    texto: 'Apoie a arborização urbana e a conservação de florestas, que ajudam a absorver o excesso de carbono.',
    icone: <Sprout className="h-8 w-8 text-forest-700" />,
  },
  {
    titulo: 'Consumo Consciente',
    texto: 'Reduza o desperdício, reutilize o que puder e prefira produtos de marcas que respeitam o meio ambiente.',
    icone: <Recycle className="h-8 w-8 text-forest-700" />,
  },
];

const EXTRAS = [
  {
    titulo: 'Separe os recicláveis',
    texto: 'Papel, plástico, vidro e metal limpos seguem para a coleta seletiva. O resto do lixo comum diminui e o aterro emite menos metano.',
  },
  {
    titulo: 'Descarte óleo, pilhas e eletrônicos',
    texto: 'Esses resíduos não vão para o lixo comum. Leve-os a um ecoponto: óleo em garrafa fechada, pilhas e eletrônicos nos coletores certos.',
  },
  {
    titulo: 'Encurte o chuveiro e a torneira',
    texto: 'Água tratada e aquecida também pesa na pegada. Banhos mais curtos e torneira fechada ao ensaboar a louça reduzem energia e desperdício.',
  },
  {
    titulo: 'Compartilhe o que aprendeu',
    texto: 'Uma oficina, um mutirão de plantio ou uma conversa em casa multiplicam o efeito. A ODS 13 se faz com gente, não só com metas.',
  },
];

export default function BoasPraticas() {
  const [abertas, setAbertas] = useState(false);

  return (
    <section id="mitigacao" className="secao border-t border-white/70 bg-mist py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-extrabold text-forest-900 md:text-3xl">
          Boas Práticas na Mitigação das Mudanças Climáticas
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PRINCIPAIS.map((item) => (
            <article key={item.titulo} className="card px-5 py-6 text-center">
              <div className="flex justify-center">{item.icone}</div>
              <h3 className="mt-4 font-bold text-forest-800">{item.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.texto}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button type="button" className="btn btn-solid" aria-expanded={abertas} onClick={() => setAbertas((valor) => !valor)}>
            {abertas ? 'Ocultar dicas extras' : 'Ver Todas as Boas Práticas'}
          </button>
        </div>

        {abertas && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {EXTRAS.map((item) => (
              <article key={item.titulo} className="rounded-2xl border border-forest-700/10 bg-white px-5 py-4">
                <h3 className="font-bold text-forest-800">{item.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.texto}</p>
              </article>
            ))}
            <p className="md:col-span-2 text-center text-sm text-slate-600">
              Quer medir o efeito dessas escolhas?{' '}
              <Link to="/calculadora" className="font-semibold text-forest-800 underline-offset-2 hover:underline">
                Use a calculadora de pegada
              </Link>
              {' '}ou{' '}
              <Link to="/pontos-coleta" className="font-semibold text-forest-800 underline-offset-2 hover:underline">
                encontre um ecoponto
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
