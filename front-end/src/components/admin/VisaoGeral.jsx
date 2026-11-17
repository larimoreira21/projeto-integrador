import { useEffect, useState } from 'react';
import api, { mensagemErro } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../Spinner';

const PERFIS = {
  cidadao: 'Cidadão',
  educador: 'Educador',
  voluntario: 'Voluntário',
};

export default function VisaoGeral({ pedirExclusao }) {
  const { notificar } = useToast();
  const [voluntarios, setVoluntarios] = useState([]);
  const [stats, setStats] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = () => {
    setCarregando(true);
    return Promise.all([
      api.get('/voluntarios'),
      api.get('/calculadora-pegada/estatisticas'),
    ]).then(([lista, resumo]) => {
      setVoluntarios(lista.data.data);
      setStats(resumo.data.data);
    }).catch((error) => notificar(mensagemErro(error), 'erro'))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregar();
    // Recarrega ao abrir a aba.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (carregando) {
    return <div className="flex justify-center py-16"><Spinner className="h-8 w-8 text-forest-800" /></div>;
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        <Metrica titulo="Voluntários inscritos" valor={voluntarios.length} />
        <Metrica titulo="Simulações de pegada" valor={stats?.total_simulacoes ?? 0} />
        <Metrica
          titulo="Média de CO₂"
          valor={Number(stats?.media_emissao_kg || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          sufixo="kg/ano"
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Distribuicao rotulo="Baixo" valor={stats?.distribuicao_impacto?.baixo ?? 0} />
        <Distribuicao rotulo="Moderado" valor={stats?.distribuicao_impacto?.moderado ?? 0} />
        <Distribuicao rotulo="Alto" valor={stats?.distribuicao_impacto?.alto ?? 0} />
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-mist text-xs uppercase tracking-wide text-forest-800">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Bairro</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Interesse</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {voluntarios.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Nenhum voluntário inscrito ainda.</td>
              </tr>
            )}
            {voluntarios.map((pessoa) => (
              <tr key={pessoa.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-forest-900">{pessoa.nome}</td>
                <td className="px-4 py-3">{pessoa.email}</td>
                <td className="px-4 py-3">{pessoa.bairro}, {pessoa.cidade}</td>
                <td className="px-4 py-3">{PERFIS[pessoa.perfil] || pessoa.perfil}</td>
                <td className="px-4 py-3">{pessoa.area_interesse}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="text-sm font-semibold text-rose-700"
                    onClick={() => pedirExclusao({
                      titulo: 'Remover voluntário',
                      mensagem: `Excluir o cadastro de ${pessoa.nome}? Essa ação não pode ser desfeita.`,
                      url: `/voluntarios/${pessoa.id}`,
                      depois: carregar,
                    })}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Metrica({ titulo, valor, sufixo }) {
  return (
    <article className="card p-5">
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className="mt-2 text-3xl font-extrabold text-forest-900">
        {valor}
        {sufixo && <span className="ml-2 text-sm font-semibold text-slate-500">{sufixo}</span>}
      </p>
    </article>
  );
}

function Distribuicao({ rotulo, valor }) {
  return (
    <p className="rounded-xl bg-white px-4 py-3 text-sm text-slate-600 shadow-card">
      Impacto <strong className="text-forest-900">{rotulo}</strong>: {valor}
    </p>
  );
}
