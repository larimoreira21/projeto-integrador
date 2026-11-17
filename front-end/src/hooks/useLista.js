import { useCallback, useEffect, useState } from 'react';
import api, { mensagemErro } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function useLista(caminho) {
  const { notificar } = useToast();
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(() => {
    setCarregando(true);
    return api.get(caminho)
      .then(({ data }) => setItens(data.data))
      .catch((error) => notificar(mensagemErro(error), 'erro'))
      .finally(() => setCarregando(false));
  }, [caminho, notificar]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { itens, carregando, recarregar };
}
