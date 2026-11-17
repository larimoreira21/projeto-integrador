<?php

namespace Tests\Feature;

use App\Models\SimulacaoPegada;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CalculadoraPegadaTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function calculo_publico_persiste_e_devolve_o_detalhamento(): void
    {
        $resposta = $this->postJson('/api/calculadora-pegada', [
            'transporte_principal' => 'carro_combustao',
            'km_semanais' => 120,
            'kwh_mensal' => 210,
            'recicla_residuos' => 'as_vezes',
        ]);

        $resposta->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Cálculo de pegada de carbono realizado com sucesso.')
            ->assertJsonPath('data.nivel_impacto', 'moderado')
            ->assertJsonPath('data.detalhamento.transporte_kg', 1310.4)
            ->assertJsonPath('data.detalhamento.energia_kg', 214.2)
            ->assertJsonPath('data.detalhamento.residuos_kg', 250);

        $this->assertEqualsWithDelta(1774.6, $resposta->json('data.emissao_anual_kg'), 0.001);
        $this->assertCount(1, SimulacaoPegada::all());
    }

    #[Test]
    public function estatisticas_exigem_admin_e_agregam_as_simulacoes(): void
    {
        $this->getJson('/api/calculadora-pegada/estatisticas')->assertUnauthorized();

        $this->postJson('/api/calculadora-pegada', [
            'transporte_principal' => 'bicicleta_caminhada',
            'km_semanais' => 10,
            'kwh_mensal' => 50,
            'recicla_residuos' => 'sempre',
        ])->assertCreated();

        $this->autenticarAdmin();

        $this->getJson('/api/calculadora-pegada/estatisticas')
            ->assertOk()
            ->assertJsonPath('data.total_simulacoes', 1)
            ->assertJsonPath('data.distribuicao_impacto.baixo', 1)
            ->assertJsonPath('data.distribuicao_impacto.moderado', 0)
            ->assertJsonPath('data.distribuicao_impacto.alto', 0);
    }
}
