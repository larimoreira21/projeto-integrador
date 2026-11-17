<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFaqRequest;
use App\Http\Requests\UpdateFaqRequest;
use App\Models\PerguntaFaq;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $consulta = PerguntaFaq::query()
            ->where('status', 'publicada')
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        $this->aplicarBusca($consulta, $request);

        return $this->success('Perguntas frequentes recuperadas com sucesso.', $consulta->get());
    }

    public function store(StoreFaqRequest $request): JsonResponse
    {
        $faq = PerguntaFaq::query()->create([
            'autor_nome' => $request->validated('autor_nome'),
            'pergunta' => $request->validated('pergunta'),
            'resposta' => null,
            'status' => 'pendente',
            'respondido_por' => null,
        ]);

        return $this->success(
            'Dúvida enviada com sucesso! Ela será analisada por nossos educadores.',
            $faq,
            201,
        );
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $consulta = PerguntaFaq::query()
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        $this->aplicarBusca($consulta, $request);

        return $this->success('Perguntas frequentes recuperadas com sucesso.', $consulta->get());
    }

    public function update(UpdateFaqRequest $request, PerguntaFaq $perguntaFaq): JsonResponse
    {
        $dados = $request->validated();

        if (array_key_exists('resposta', $dados) && $dados['resposta'] === '') {
            $dados['resposta'] = null;
        }

        $dados['respondido_por'] = $request->user()->id;

        $perguntaFaq->update($dados);

        return $this->success('Pergunta atualizada com sucesso.', $perguntaFaq->fresh());
    }

    public function destroy(PerguntaFaq $perguntaFaq): JsonResponse
    {
        $perguntaFaq->delete();

        return $this->success('Pergunta removida com sucesso.');
    }

    private function aplicarBusca(Builder $consulta, Request $request): void
    {
        if (! $request->filled('busca')) {
            return;
        }

        $termo = '%'.str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $request->string('busca')->toString()).'%';

        $consulta->where(function ($query) use ($termo) {
            $query->where('pergunta', 'like', $termo)
                ->orWhere('resposta', 'like', $termo);
        });
    }
}
