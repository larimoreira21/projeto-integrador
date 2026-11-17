import { useEffect, useState } from 'react';
import api, { errosCampos, mensagemErro } from '../services/api';
import { useEngagement } from '../context/EngagementContext';
import { useToast } from '../context/ToastContext';
import { Spinner } from './Spinner';

const INICIAL = {
  nome: '',
  email: '',
  telefone: '',
  bairro: '',
  cidade: '',
  perfil: 'cidadao',
  area_interesse: '',
};

const AREAS = ['Mutirão de Plantio', 'Oficinas Educativas', 'Coleta Seletiva', 'Arborização', 'Educação Ambiental'];

export default function EngagementModal() {
  const { aberto, modo, fechar } = useEngagement();
  const { notificar } = useToast();
  const [form, setForm] = useState(INICIAL);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [sessao, setSessao] = useState({ aberto: false, modo: 'cidadao' });

  if (aberto && (sessao.aberto !== aberto || sessao.modo !== modo)) {
    setSessao({ aberto, modo });
    setForm({
      ...INICIAL,
      perfil: modo === 'equipe' ? 'educador' : 'cidadao',
    });
    setErros({});
    setSucesso('');
    setEnviando(false);
  }

  useEffect(() => {
    if (!aberto) return undefined;
    document.body.style.overflow = 'hidden';
    const aoTeclar = (evento) => {
      if (evento.key === 'Escape') fechar();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', aoTeclar);
    };
  }, [aberto, modo, fechar]);

  if (!aberto) return null;

  const alterar = (campo) => (evento) => {
    setForm((atual) => ({ ...atual, [campo]: evento.target.value }));
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setErros({});
    try {
      const { data } = await api.post('/voluntarios', {
        ...form,
        telefone: form.telefone.trim() || null,
      });
      setSucesso(data.message);
      notificar(data.message);
    } catch (error) {
      setErros(errosCampos(error));
      notificar(mensagemErro(error), 'erro');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-forest-950/50 p-4" onClick={() => !enviando && fechar()}>
      <form className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-card" onClick={(evento) => evento.stopPropagation()} onSubmit={enviar}>
        <h2 className="text-xl font-extrabold text-forest-900">
          {modo === 'equipe' ? 'Sou educador ou voluntário' : 'Quero me engajar'}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Conte onde você está e como quer participar. A equipe usa esses dados para organizar ações na cidade.
        </p>

        {sucesso ? (
          <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-950">
            <p className="font-semibold">{sucesso}</p>
            <p className="mt-1">Obrigado por entrar. Em breve as ações do seu bairro podem contar com você.</p>
            <button type="button" className="btn btn-solid mt-4" onClick={fechar}>Fechar</button>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="label">Nome</span>
              <input className="field" required minLength={3} maxLength={120} value={form.nome} onChange={alterar('nome')} />
              {erros.nome && <CampoErro texto={erros.nome[0]} />}
            </label>
            <label>
              <span className="label">E-mail</span>
              <input className="field" type="email" required maxLength={150} value={form.email} onChange={alterar('email')} />
              {erros.email && <CampoErro texto={erros.email[0]} />}
            </label>
            <label>
              <span className="label">Telefone</span>
              <input className="field" maxLength={20} value={form.telefone} onChange={alterar('telefone')} placeholder="(12) 99999-0000" />
              {erros.telefone && <CampoErro texto={erros.telefone[0]} />}
            </label>
            <label>
              <span className="label">Bairro</span>
              <input className="field" required maxLength={100} value={form.bairro} onChange={alterar('bairro')} />
              {erros.bairro && <CampoErro texto={erros.bairro[0]} />}
            </label>
            <label>
              <span className="label">Cidade</span>
              <input className="field" required maxLength={100} value={form.cidade} onChange={alterar('cidade')} placeholder="Taubaté" />
              {erros.cidade && <CampoErro texto={erros.cidade[0]} />}
            </label>
            <label className="sm:col-span-2">
              <span className="label">Perfil</span>
              {modo === 'equipe' ? (
                <select className="field" value={form.perfil} onChange={alterar('perfil')}>
                  <option value="educador">Educador</option>
                  <option value="voluntario">Voluntário</option>
                </select>
              ) : (
                <input className="field bg-mist" value="Cidadão" readOnly />
              )}
              {erros.perfil && <CampoErro texto={erros.perfil[0]} />}
            </label>
            <label className="sm:col-span-2">
              <span className="label">Área de interesse</span>
              <input className="field" required maxLength={150} list="areas-interesse" value={form.area_interesse} onChange={alterar('area_interesse')} placeholder="Ex.: Oficinas Educativas" />
              <datalist id="areas-interesse">
                {AREAS.map((area) => <option key={area} value={area} />)}
              </datalist>
              {erros.area_interesse && <CampoErro texto={erros.area_interesse[0]} />}
            </label>
            <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
              <button type="button" className="btn btn-outline" disabled={enviando} onClick={fechar}>Cancelar</button>
              <button type="submit" className="btn btn-solid" disabled={enviando}>
                {enviando && <Spinner className="h-4 w-4" />}
                Enviar cadastro
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function CampoErro({ texto }) {
  return <span className="mt-1 block text-xs text-rose-700">{texto}</span>;
}
