<?php

namespace Tests\Unit;

use App\Services\CalculadoraPegadaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CalculadoraPegadaServiceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function cenario_de_baixo_impacto_com_bicicleta_baixo_kwh_e_reciclagem_constante(): void
    {
        $resultado = (new CalculadoraPegadaService())->calcular([
            'transporte_principal' => 'bicicleta_caminhada',
            'km_semanais' => 25,
            'kwh_mensal' => 50,
            'recicla_residuos' => 'sempre',
        ]);

        $this->assertEqualsWithDelta(0.0, $resultado['transporte_kg'], 0.001);
        $this->assertEqualsWithDelta(51.0, $resultado['energia_kg'], 0.001);
        $this->assertEqualsWithDelta(100.0, $resultado['residuos_kg'], 0.001);
        $this->assertEqualsWithDelta(151.0, $resultado['emissao_anual_kg'], 0.001);
        $this->assertSame('baixo', $resultado['nivel_impacto']);
        $this->assertCountBetween($resultado['recomendacoes']);
    }

    #[Test]
    public function cenario_de_impacto_moderado_no_exemplo_da_calculadora(): void
    {
        $resultado = (new CalculadoraPegadaService())->calcular([
            'transporte_principal' => 'carro_combustao',
            'km_semanais' => 120,
            'kwh_mensal' => 210,
            'recicla_residuos' => 'as_vezes',
        ]);

        $this->assertEqualsWithDelta(1310.40, $resultado['transporte_kg'], 0.001);
        $this->assertEqualsWithDelta(214.20, $resultado['energia_kg'], 0.001);
        $this->assertEqualsWithDelta(250.0, $resultado['residuos_kg'], 0.001);
        $this->assertEqualsWithDelta(1774.60, $resultado['emissao_anual_kg'], 0.001);
        $this->assertSame('moderado', $resultado['nivel_impacto']);
        $this->assertContains(
            'Substitua trajetos curtos de carro por bicicleta ou transporte público.',
            $resultado['recomendacoes'],
        );
        $this->assertContains(
            'Separe resíduos recicláveis regularmente para reduzir emissões em aterros.',
            $resultado['recomendacoes'],
        );
        $this->assertCountBetween($resultado['recomendacoes']);
    }

    #[Test]
    public function cenario_de_alto_impacto_com_carro_alta_km_alto_kwh_e_sem_reciclagem(): void
    {
        $resultado = (new CalculadoraPegadaService())->calcular([
            'transporte_principal' => 'carro_combustao',
            'km_semanais' => 500,
            'kwh_mensal' => 800,
            'recicla_residuos' => 'nunca',
        ]);

        $this->assertEqualsWithDelta(5460.0, $resultado['transporte_kg'], 0.001);
        $this->assertEqualsWithDelta(816.0, $resultado['energia_kg'], 0.001);
        $this->assertEqualsWithDelta(450.0, $resultado['residuos_kg'], 0.001);
        $this->assertEqualsWithDelta(6726.0, $resultado['emissao_anual_kg'], 0.001);
        $this->assertSame('alto', $resultado['nivel_impacto']);
        $this->assertNotEmpty($resultado['recomendacoes']);
        $this->assertCountBetween($resultado['recomendacoes']);
    }

    /**
     * @param  list<string>  $recomendacoes
     */
    private function assertCountBetween(array $recomendacoes): void
    {
        $this->assertGreaterThanOrEqual(3, count($recomendacoes));
        $this->assertLessThanOrEqual(4, count($recomendacoes));
    }
}
