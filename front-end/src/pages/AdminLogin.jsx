import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mensagemErro } from '../services/api';
import { Spinner } from '../components/Spinner';

export default function AdminLogin() {
  const { login, autenticado } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@climasustentavel.org');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (autenticado) {
    return <Navigate to="/admin" replace />;
  }

  const entrar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setErro('');
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="bg-mist py-16">
      <form className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-card" onSubmit={entrar}>
        <div className="flex items-center gap-2 text-forest-800">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest-800 text-white">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-extrabold">Área administrativa</span>
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-forest-900">Entrar</h1>
        <p className="mt-1 text-sm text-slate-600">Use a conta de educador para moderar conteúdos, ecopontos e dúvidas.</p>
        <label className="mt-5 block">
          <span className="label">E-mail</span>
          <input className="field" type="email" required value={email} onChange={(evento) => setEmail(evento.target.value)} />
        </label>
        <label className="mt-3 block">
          <span className="label">Senha</span>
          <input className="field" type="password" required value={password} onChange={(evento) => setPassword(evento.target.value)} />
        </label>
        {erro && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{erro}</p>}
        <button type="submit" className="btn btn-solid mt-5 w-full" disabled={enviando}>
          {enviando && <Spinner className="h-4 w-4" />}
          Entrar
        </button>
      </form>
    </section>
  );
}
