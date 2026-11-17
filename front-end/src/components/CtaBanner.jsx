import { useEngagement } from '../context/EngagementContext';

export default function CtaBanner() {
  const { abrir } = useEngagement();

  return (
    <section className="bg-forest-800 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="text-2xl font-extrabold md:text-3xl">Sua atitude combate as mudanças climáticas</h2>
          <p className="mt-2 text-sm text-emerald-50/85 md:text-base">
            Informar-se e agir com responsabilidade é proteger o amanhã de todos.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-white" onClick={() => abrir('cidadao')}>
            Quero Me Engajar
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => abrir('equipe')}>
            Sou Educador / Voluntário
          </button>
        </div>
      </div>
    </section>
  );
}
