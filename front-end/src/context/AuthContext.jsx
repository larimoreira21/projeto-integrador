import { createContext, useContext, useMemo, useState } from 'react';
import api, { mensagemErro } from '../services/api';

const AuthContext = createContext(null);

function lerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('clima_usuario') || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('clima_token'));
  const [usuario, setUsuario] = useState(lerUsuario);

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    localStorage.setItem('clima_token', data.data.token);
    localStorage.setItem('clima_usuario', JSON.stringify(data.data.user));
    setToken(data.data.token);
    setUsuario(data.data.user);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // O token já pode ter sido revogado; a sessão local é limpa mesmo assim.
    }
    localStorage.removeItem('clima_token');
    localStorage.removeItem('clima_usuario');
    setToken(null);
    setUsuario(null);
  };

  const valor = useMemo(
    () => ({ token, usuario, autenticado: Boolean(token), login, logout }),
    [token, usuario],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return contexto;
}

export { mensagemErro };
