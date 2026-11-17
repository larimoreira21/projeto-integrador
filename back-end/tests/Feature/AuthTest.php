<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function login_valido_retorna_token_e_credencial_invalida_retorna_401(): void
    {
        User::factory()->create([
            'name' => 'Administrador Clima Sustentável',
            'email' => 'admin@climasustentavel.org',
            'password' => 'Admin@123',
        ]);

        $login = $this->postJson('/api/login', [
            'email' => 'admin@climasustentavel.org',
            'password' => 'Admin@123',
        ]);

        $login->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Login realizado com sucesso.')
            ->assertJsonPath('data.user.email', 'admin@climasustentavel.org');

        $this->assertIsString($login->json('data.token'));

        $this->postJson('/api/login', [
            'email' => 'admin@climasustentavel.org',
            'password' => 'senha-errada',
        ])->assertUnauthorized()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Credenciais inválidas.');
    }

    #[Test]
    public function logout_revoga_o_token_atual(): void
    {
        User::factory()->create([
            'email' => 'admin@climasustentavel.org',
            'password' => 'Admin@123',
        ]);

        $token = $this->postJson('/api/login', [
            'email' => 'admin@climasustentavel.org',
            'password' => 'Admin@123',
        ])->json('data.token');

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout realizado com sucesso.');

        $this->assertDatabaseCount('personal_access_tokens', 0);

        // O cliente HTTP reaproveita os guards da aplicação. Limpar força a próxima
        // requisição a consultar de novo o token já revogado.
        $this->app['auth']->forgetGuards();

        $this->withToken($token)
            ->getJson('/api/voluntarios')
            ->assertUnauthorized();
    }
}
