<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FaqTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function duvida_nasce_pendente_e_so_aparece_depois_que_o_admin_publica(): void
    {
        $envio = $this->postJson('/api/faqs', [
            'autor_nome' => 'Carlos',
            'pergunta' => 'Onde descartar lâmpadas fluorescentes?',
        ]);

        $envio->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Dúvida enviada com sucesso! Ela será analisada por nossos educadores.')
            ->assertJsonPath('data.status', 'pendente')
            ->assertJsonPath('data.resposta', null);

        $id = $envio->json('data.id');

        $publicas = $this->getJson('/api/faqs');
        $publicas->assertOk()->assertJsonPath('success', true);
        $this->assertFalse(
            collect($publicas->json('data'))->pluck('id')->contains($id),
        );

        $admin = $this->autenticarAdmin();

        $this->putJson('/api/admin/faqs/'.$id, [
            'resposta' => 'Descarte em ecopontos de eletrônicos ou pilhas, nunca no lixo comum.',
            'status' => 'publicada',
        ])->assertOk()
            ->assertJsonPath('data.status', 'publicada')
            ->assertJsonPath('data.respondido_por', $admin->id);

        $this->getJson('/api/faqs')
            ->assertOk()
            ->assertJsonFragment([
                'id' => $id,
                'status' => 'publicada',
            ]);
    }
}
