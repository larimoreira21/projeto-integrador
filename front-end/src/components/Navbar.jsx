import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';

const SECOES = [
  { id: 'educacao', rotulo: 'Educação' },
  { id: 'mitigacao', rotulo: 'Mitigação' },
  { id: 'acao', rotulo: 'Ação Climática' },
  { id: 'recursos', rotulo: 'Recursos' },
  { id: 'sobre', rotulo: 'Sobre' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    setAberto(false);
  }, [location.pathname, location.hash]);

  const irParaSecao = (id) => {
    setAberto(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const linkAtivo = (caminho) => location.pathname === caminho;

  return (
    <header className="sticky top-0 z-40 border-b border-forest-800/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest-800 text-white">
            <Leaf className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[15px] font-extrabold tracking-tight text-forest-900">Clima Sustentável</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-5 text-sm text-slate-600 lg:flex">
          {SECOES.map((secao) => (
            <button key={secao.id} type="button" className="hover:text-forest-800" onClick={() => irParaSecao(secao.id)}>
              {secao.rotulo}
            </button>
          ))}
          <span className="h-4 w-px bg-slate-200" />
          <Link to="/pontos-coleta" className={`font-semibold ${linkAtivo('/pontos-coleta') ? 'text-forest-800 underline decoration-forest-700/40 underline-offset-4' : 'text-forest-800'}`}>
            Pontos de Coleta
          </Link>
          <Link to="/calculadora" className={`font-semibold ${linkAtivo('/calculadora') ? 'text-forest-800 underline decoration-forest-700/40 underline-offset-4' : 'text-forest-800'}`}>
            Calculadora
          </Link>
          <Link to="/admin" className="rounded-full border border-forest-800/15 px-3 py-1.5 text-xs font-semibold text-forest-800 hover:bg-mist">
            Área Admin
          </Link>
        </nav>

        <button type="button" className="ml-auto rounded-lg p-2 text-forest-900 lg:hidden" onClick={() => setAberto((valor) => !valor)} aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}>
          {aberto ? <X /> : <Menu />}
        </button>
      </div>

      {aberto && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {SECOES.map((secao) => (
              <button key={secao.id} type="button" className="text-left text-slate-700" onClick={() => irParaSecao(secao.id)}>
                {secao.rotulo}
              </button>
            ))}
            <Link to="/pontos-coleta" className="font-semibold text-forest-800">Pontos de Coleta</Link>
            <Link to="/calculadora" className="font-semibold text-forest-800">Calculadora de Carbono</Link>
            <Link to="/admin" className="font-semibold text-forest-800">Área Admin</Link>
          </div>
        </div>
      )}
    </header>
  );
}
