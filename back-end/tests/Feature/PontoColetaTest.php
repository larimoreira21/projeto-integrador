<?php

namespace Tests\Feature;

use App\Models\CategoriaResiduo;
use App\Models\PontoColeta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PontoColetaTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function listagem_publica_filtra_por_categoria_bairro_e_oculta_nao_aprovados(): void
    {
        $reciclaveis = CategoriaResiduo::query()->create([
            'nome' => 'Recicláveis',
            'slug' => 'reciclaveis',
            'cor_badge' => '#1E5631',
        ]);
        $eletronicos = CategoriaResiduo::query()->create([
            'nome' => 'Eletrônicos',
            'slug' => 'eletronicos',
            'cor_badge' => '#0D7377',
        ]);

        PontoColeta::query()->create([
            'categoria_residuo_id' => $reciclaveis->id,
            'nome_local' => 'Ecoponto Central',
            'endereco' => 'Rua do Comércio, 10',
            'bairro' => 'Centro',
            'cidade' => 'Taubaté',
            'horario_funcionamento' => 'Seg a Sáb, das 08h às 17h',
            'aprovado' => true,
        ]);

        PontoColeta::query()->create([
            'categoria_residuo_id' => $eletronicos->id,
            'nome_local' => 'Coleta Norte',
            'endereco' => 'Av. Norte, 80',
            'bairro' => 'Independência',
            'cidade' => 'Taubaté',
            'horario_funcionamento' => 'Seg a Sex, das 09h às 16h',
            'aprovado' => true,
        ]);

        PontoColeta::query()->create([
            'categoria_residuo_id' => $reciclaveis->id,
            'nome_local' => 'Ecoponto Oculto',
            'endereco' => 'Rua Escondida, 1',
            'bairro' => 'Centro',
            'cidade' => 'Taubaté',
            'horario_funcionamento' => 'Fechado para manutenção',
            'aprovado' => false,
        ]);

        $lista = $this->getJson('/api/pontos-coleta')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(2, 'data');

        $lista->assertJsonFragment(['nome_local' => 'Ecoponto Central', 'bairro' => 'Centro']);
        $lista->assertJsonFragment(['nome_local' => 'Coleta Norte', 'bairro' => 'Independência']);
        $lista->assertJsonFragment(['slug' => 'reciclaveis']);
        $lista->assertJsonMissing(['nome_local' => 'Ecoponto Oculto']);

        $this->getJson('/api/pontos-coleta?categoria_residuo_id='.$eletronicos->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nome_local', 'Coleta Norte');

        $this->getJson('/api/pontos-coleta?bairro=Centro')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nome_local', 'Ecoponto Central');

        $this->getJson('/api/pontos-coleta?busca=ecoponto')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nome_local', 'Ecoponto Central');
    }

    #[Test]
    public function admin_cadastra_ponto_e_exclui_com_200(): void
    {
        $categoria = CategoriaResiduo::query()->create([
            'nome' => 'Eletrônicos',
            'slug' => 'eletronicos',
            'cor_badge' => '#0D7377',
        ]);

        $payload = [
            'categoria_residuo_id' => $categoria->id,
            'nome_local' => 'Ecoponto Municipal Norte',
            'endereco' => 'Av. das Palmeiras, 450',
            'bairro' => 'Jardim das Nações',
            'cidade' => 'Taubaté',
            'horario_funcionamento' => 'Seg a Sáb, das 08h às 17h',
        ];

        $this->postJson('/api/pontos-coleta', $payload)->assertUnauthorized();

        $ponto = PontoColeta::query()->create([
            ...$payload,
            'aprovado' => true,
        ]);

        $this->deleteJson('/api/pontos-coleta/'.$ponto->id)->assertUnauthorized();

        $this->autenticarAdmin();

        $criado = $this->postJson('/api/pontos-coleta', $payload);

        $criado->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.nome_local', 'Ecoponto Municipal Norte')
            ->assertJsonPath('data.aprovado', true)
            ->assertJsonPath('data.categoria_residuo.id', $categoria->id);

        $id = $criado->json('data.id');

        $this->deleteJson('/api/pontos-coleta/'.$id)
            ->assertOk()
            ->assertJsonPath('message', 'Ponto de coleta removido com sucesso.');

        $this->assertDatabaseMissing('pontos_coleta', ['id' => $id]);
    }
}
