<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RecursoEducativoTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function listagem_publica_filtra_tipo_e_cadastro_exige_admin(): void
    {
        $this->postJson('/api/recursos', $this->payload())->assertUnauthorized();

        $admin = $this->autenticarAdmin();

        $this->postJson('/api/recursos', $this->payload())
            ->assertCreated()
            ->assertJsonPath('data.tipo', 'guia')
            ->assertJsonPath('data.user_id', $admin->id);

        $this->postJson('/api/recursos', [
            'titulo' => 'Mobilidade ativa no Vale do Paraíba',
            'tipo' => 'video',
            'categoria' => 'Transporte',
            'descricao' => 'Vídeo sobre bicicleta e transporte público.',
            'url_conteudo' => 'https://climasustentavel.org/videos/mobilidade-sustentavel',
        ])->assertCreated();

        $this->getJson('/api/recursos?tipo=guia&categoria=Energia')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.titulo', 'Como Reduzir a Conta de Luz e as Emissões');
    }

    /**
     * @return array<string, string>
     */
    private function payload(): array
    {
        return [
            'titulo' => 'Como Reduzir a Conta de Luz e as Emissões',
            'tipo' => 'guia',
            'categoria' => 'Energia',
            'descricao' => 'Guia prático de eficiência energética.',
            'url_conteudo' => 'https://climasustentavel.org/guias/energia-em-casa',
        ];
    }
}
