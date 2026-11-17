import { ArrowRight, Footprints, Sprout, Users } from 'lucide-react';

const PASSOS = [
  {
    numero: '1',
    titulo: 'Entenda',
    texto: 'Busque informações sobre as causas e os impactos do aquecimento global.',
    icone: <CabecaComGlobo />,
  },
  {
    numero: '2',
    titulo: 'Reduza',
    texto: 'Minimize o uso de recursos naturais, água e energia no seu dia a dia.',
    icone: <Footprints className="h-10 w-10 text-forest-700" />,
  },
  {
    numero: '3',
    titulo: 'Engaje',
    texto: 'Compartilhe o aprendizado com sua família, amigos e na sua comunidade.',
    icone: <Users className="h-10 w-10 text-forest-700" />,
  },
  {
    numero: '4',
    titulo: 'Preserve',
    texto: 'Apoie e participe de ações locais de preservação ambiental.',
    icone: <Sprout className="h-10 w-10 text-forest-700" />,
  },
];

function CabecaComGlobo() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12 text-forest-700" aria-hidden="true">
      <path d="M32 10c8 0 14 7 14 16 0 10-6 16-14 22-8-6-14-12-14-22 0-9 6-16 14-16z" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="24" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M26 24h12M32 18c2.2 2 3.2 4 3.2 6s-1 4-3.2 6c-2.2-2-3.2-4-3.2-6s1-4 3.2-6z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function AcaoClimatica() {
  return (
    <section id="acao" className="secao bg-mist py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-extrabold text-forest-900 md:text-3xl">
          Ação Climática: Como Você Pode Fazer a Diferença
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-4">
          {PASSOS.map((passo, indice) => (
            <li key={passo.numero} className="relative text-center">
              {indice < PASSOS.length - 1 && (
                <ArrowRight className="absolute -right-4 top-10 hidden h-5 w-5 text-forest-600 md:block" aria-hidden="true" />
              )}
              <div className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-forest-800 text-sm font-bold text-white">
                {passo.numero}
              </div>
              <div className="mt-4 flex justify-center">{passo.icone}</div>
              <h3 className="mt-3 font-bold text-forest-800">{passo.titulo}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{passo.texto}</p>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-3 rounded-2xl border border-[#d7e2b8] bg-note px-5 py-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-sm font-extrabold text-forest-800 sm:shrink-0">
            <span aria-hidden="true">🍃</span>
            O que NÃO fazer:
          </p>
          <p className="text-sm leading-relaxed text-slate-700">
            Não desperdice recursos naturais, evite plásticos de uso único e não descarte resíduos de forma inadequada. Toda ação importa.
          </p>
        </div>
      </div>
    </section>
  );
}
