<?php

namespace Tests\Feature;

use App\Models\Voluntario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class VoluntarioTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function cadastro_valido_retorna_201_e_email_duplicado_retorna_422(): void
    {
        $payload = [
            'nome' => 'Mariana Silva',
            'email' => 'mariana@email.com',
            'telefone' => '(12) 99999-0000',
            'bairro' => 'Centro',
            'cidade' => 'Taubaté',
            'perfil' => 'educador',
            'area_interesse' => 'Oficinas Educativas',
        ];

        $criado = $this->postJson('/api/voluntarios', $payload);

        $criado->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Voluntário cadastrado com sucesso.')
            ->assertJsonPath('data.email', 'mariana@email.com')
            ->assertJsonPath('data.perfil', 'educador');

        $this->assertDatabaseHas('voluntarios', ['email' => 'mariana@email.com']);

        $duplicado = $this->postJson('/api/voluntarios', $payload);

        $duplicado->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Erro de validação nos dados enviados.')
            ->assertJsonPath('errors.email.0', 'Este e-mail já está cadastrado.');
    }

    #[Test]
    public function listagem_bloqueia_anonimo_e_permite_admin_com_token(): void
    {
        $antigo = Voluntario::query()->create([
            'nome' => 'Ana Costa',
            'email' => 'ana.costa@email.com',
            'telefone' => '(12) 98888-1001',
            'bairro' => 'Centro',
            'cidade' => 'Taubaté',
            'perfil' => 'cidadao',
            'area_interesse' => 'Mutirão de Plantio',
        ]);
        $antigo->forceFill(['created_at' => now()->subMinute()])->save();

        Voluntario::query()->create([
            'nome' => 'Pedro Almeida',
            'email' => 'pedro.almeida@email.com',
            'bairro' => 'Independência',
            'cidade' => 'Taubaté',
            'perfil' => 'educador',
            'area_interesse' => 'Coleta Seletiva',
        ]);

        $this->getJson('/api/voluntarios')
            ->assertUnauthorized()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Não autenticado. Faça login para continuar.');

        $this->autenticarAdmin();

        $resposta = $this->getJson('/api/voluntarios?perfil=educador');

        $resposta->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.email', 'pedro.almeida@email.com');

        $todos = $this->getJson('/api/voluntarios');
        $todos->assertOk()->assertJsonCount(2, 'data');

        $ids = collect($todos->json('data'))->pluck('id')->all();
        $this->assertSame(
            Voluntario::query()->orderByDesc('created_at')->orderByDesc('id')->pluck('id')->all(),
            $ids,
        );
    }

    #[Test]
    public function admin_remove_voluntario_e_id_inexistente_retorna_404(): void
    {
        $voluntario = Voluntario::query()->create([
            'nome' => 'Ana Costa',
            'email' => 'ana.costa@email.com',
            'bairro' => 'Centro',
            'cidade' => 'Taubaté',
            'perfil' => 'cidadao',
            'area_interesse' => 'Mutirão de Plantio',
        ]);

        $this->autenticarAdmin();

        $this->deleteJson('/api/voluntarios/'.$voluntario->id)
            ->assertOk()
            ->assertJsonPath('message', 'Voluntário removido com sucesso.');

        $this->assertDatabaseMissing('voluntarios', ['id' => $voluntario->id]);

        $this->deleteJson('/api/voluntarios/9999')
            ->assertNotFound()
            ->assertJsonPath('message', 'Recurso não encontrado.');
    }
}
