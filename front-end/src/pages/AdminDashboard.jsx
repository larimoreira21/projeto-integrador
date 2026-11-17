import { useState } from 'react';
import { LogOut } from 'lucide-react';
import api, { mensagemErro } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/Spinner';
import ConfirmDialog from '../components/ConfirmDialog';
import VisaoGeral from '../components/admin/VisaoGeral';
import GerenciarPontos from '../components/admin/GerenciarPontos';
import GerenciarRecursos from '../components/admin/GerenciarRecursos';
import ModerarFaq from '../components/admin/ModerarFaq';

const ABAS = [
  { id: 'visao', rotulo: 'Visão geral e voluntários' },
  { id: 'pontos', rotulo: 'Pontos de coleta' },
  { id: 'recursos', rotulo: 'Recursos' },
  { id: 'faq', rotulo: 'Moderar FAQ' },
];

export default function AdminDashboard() {
  const { usuario, logout } = useAuth();
  const { notificar } = useToast();
  const [aba, setAba] = useState('visao');
  const [saindo, setSaindo] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const pedirExclusao = (config) => setConfirmacao(config);

  const confirmarExclusao = async () => {
    if (!confirmacao) return;
    setExcluindo(true);
    try {
      const { data } = await api.delete(confirmacao.url);
      notificar(data.message || 'Registro excluído com sucesso.');
      confirmacao.depois?.();
      setConfirmacao(null);
    } catch (error) {
      notificar(mensagemErro(error), 'erro');
    } finally {
      setExcluindo(false);
    }
  };

  const sair = async () => {
    setSaindo(true);
    await logout();
    window.location.assign('/admin/login');
  };

  return (
    <section className="bg-mist py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-forest-700">Painel administrativo</p>
            <h1 className="text-2xl font-extrabold text-forest-900">Olá, {usuario?.name || 'educador'}</h1>
          </div>
          <button type="button" className="btn btn-outline" onClick={sair} disabled={saindo}>
            {saindo ? <Spinner className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
            Sair
          </button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {ABAS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${aba === item.id ? 'bg-forest-800 text-white' : 'bg-white text-forest-900'}`}
              onClick={() => setAba(item.id)}
            >
              {item.rotulo}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {aba === 'visao' && <VisaoGeral pedirExclusao={pedirExclusao} />}
          {aba === 'pontos' && <GerenciarPontos pedirExclusao={pedirExclusao} />}
          {aba === 'recursos' && <GerenciarRecursos pedirExclusao={pedirExclusao} />}
          {aba === 'faq' && <ModerarFaq pedirExclusao={pedirExclusao} />}
        </div>
      </div>

      <ConfirmDialog
        aberto={Boolean(confirmacao)}
        titulo={confirmacao?.titulo || 'Excluir'}
        mensagem={confirmacao?.mensagem || ''}
        carregando={excluindo}
        onCancelar={() => !excluindo && setConfirmacao(null)}
        onConfirmar={confirmarExclusao}
      />
    </section>
  );
}
