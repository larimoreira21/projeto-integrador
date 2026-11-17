import { Link } from 'react-router-dom';
import { Leaf, Mail } from 'lucide-react';

function IconeSocial({ children, rotulo }) {
  return (
    <a href="#contato" aria-label={rotulo} className="hover:text-white">
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">{children}</svg>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-emerald-50/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest-700">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-extrabold">Clima Sustentável</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-emerald-50/75">
            Educação, conscientização e ação prática contra as mudanças climáticas em prol de um futuro seguro e resiliente para o planeta.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Navegação</h2>
          <ul className="mt-4 space-y-2 text-sm text-emerald-50/75">
            <li><Link to="/#educacao" className="hover:text-white">Educação</Link></li>
            <li><Link to="/#mitigacao" className="hover:text-white">Uso Correto</Link></li>
            <li><Link to="/pontos-coleta" className="hover:text-white">Descarte Seguro</Link></li>
            <li><Link to="/#recursos" className="hover:text-white">Recursos</Link></li>
            <li><Link to="/#sobre" className="hover:text-white">Sobre</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Recursos</h2>
          <ul className="mt-4 space-y-2 text-sm text-emerald-50/75">
            <li><Link to={{ pathname: '/', hash: 'recursos' }} state={{ painel: 'guia' }} className="hover:text-white">Guias</Link></li>
            <li><Link to={{ pathname: '/', hash: 'recursos' }} state={{ painel: 'video' }} className="hover:text-white">Vídeos</Link></li>
            <li><Link to={{ pathname: '/', hash: 'recursos' }} state={{ painel: 'faq' }} className="hover:text-white">FAQ</Link></li>
            <li><Link to="/pontos-coleta" className="hover:text-white">Pontos de Coleta</Link></li>
          </ul>
        </div>

        <div id="contato">
          <h2 className="text-sm font-bold text-white">Contato</h2>
          <a href="mailto:contato@climasustentavel.org" className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-50/80 hover:text-white">
            <Mail className="h-4 w-4" />
            contato@climasustentavel.org
          </a>
          <div className="mt-4 flex gap-3 text-emerald-50/80">
            <IconeSocial rotulo="Instagram">
              <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1zM12 9.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2z" />
            </IconeSocial>
            <IconeSocial rotulo="Facebook">
              <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
            </IconeSocial>
            <IconeSocial rotulo="YouTube">
              <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.2 3.3z" />
            </IconeSocial>
            <IconeSocial rotulo="LinkedIn">
              <path d="M5 3a2 2 0 1 0 .1 4A2 2 0 0 0 5 3zM3.5 9h3V21h-3zM10 9h2.9v1.6h.1c.4-.8 1.4-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8V21h-3v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-3z" />
            </IconeSocial>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-emerald-50/60">
        © 2026 Clima Sustentável. Todos os direitos reservados.
      </div>
    </footer>
  );
}
