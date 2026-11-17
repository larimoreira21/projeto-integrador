function SeloOds() {
  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-md bg-[#0b6b3a] text-white shadow-sm ring-4 ring-white" aria-hidden="true">
      <div className="text-center leading-none">
        <span className="block text-[9px] font-bold tracking-[0.14em]">ODS</span>
        <span className="mt-1 block text-[22px] font-extrabold">13</span>
      </div>
    </div>
  );
}

function GloboNasMaos() {
  return (
    <svg viewBox="0 0 88 64" className="h-14 w-20 shrink-0 text-forest-700" aria-hidden="true">
      <path d="M8 40c8 10 18 14 28 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M80 40c-8 10-18 14-28 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="44" cy="26" r="16" fill="#e7f3ea" stroke="currentColor" strokeWidth="2" />
      <path d="M30 26h28M44 10c6 5 8 11 8 16s-2 11-8 16c-6-5-8-11-8-16s2-11 8-16z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M22 48c6 2 12 2 18 0M48 48c6 2 12 2 18 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Hero() {
  const rolar = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="educacao" className="secao bg-mist">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-14 md:pt-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-forest-800 md:text-5xl">
            Educação e Conscientização para a Mitigação das Mudanças Climáticas
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
            Promover o conhecimento e a ação prática é essencial para combater as mudanças climáticas e proteger o nosso planeta. Pequenas atitudes geram grandes impactos.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-solid" onClick={() => rolar('recursos')}>
              Aprender Mais
            </button>
            <button type="button" className="btn btn-outline" onClick={() => rolar('mitigacao')}>
              Ver Boas Práticas
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-forest-700/10 bg-[#f7faf7] px-4 py-4 shadow-sm sm:flex-row sm:items-center md:px-5">
          <div className="flex items-center gap-3">
            <SeloOds />
            <p className="max-w-[180px] text-sm font-extrabold leading-snug text-forest-800">
              ODS 13 - Ação Contra a Mudança Global do Clima
            </p>
          </div>
          <p className="flex-1 text-sm leading-relaxed text-slate-600">
            Adotar medidas urgentes para combater as alterações climáticas e os seus impactos.
          </p>
          <GloboNasMaos />
        </div>
      </div>
    </section>
  );
}
