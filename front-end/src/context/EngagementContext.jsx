import { createContext, useContext, useMemo, useState } from 'react';

const EngagementContext = createContext(null);

export function EngagementProvider({ children }) {
  const [aberto, setAberto] = useState(false);
  const [modo, setModo] = useState('cidadao');

  const valor = useMemo(() => ({
    aberto,
    modo,
    abrir: (proximoModo = 'cidadao') => {
      setModo(proximoModo);
      setAberto(true);
    },
    fechar: () => setAberto(false),
  }), [aberto, modo]);

  return (
    <EngagementContext.Provider value={valor}>
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  const contexto = useContext(EngagementContext);
  if (!contexto) {
    throw new Error('useEngagement deve ser usado dentro de EngagementProvider.');
  }
  return contexto;
}
