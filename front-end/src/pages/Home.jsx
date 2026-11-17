import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import BoasPraticas from '../components/BoasPraticas';
import AcaoClimatica from '../components/AcaoClimatica';
import RecursosEducativos from '../components/RecursosEducativos';
import Sobre from '../components/Sobre';
import CtaBanner from '../components/CtaBanner';

export default function Home() {
  const location = useLocation();

  return (
    <>
      <Hero />
      <BoasPraticas />
      <AcaoClimatica />
      <RecursosEducativos painelInicial={location.state?.painel || null} />
      <Sobre />
      <CtaBanner />
    </>
  );
}
