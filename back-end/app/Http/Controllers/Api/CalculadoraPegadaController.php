<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CalcularPegadaRequest;
use App\Models\SimulacaoPegada;
use App\Services\CalculadoraPegadaService;
use Illuminate\Http\JsonResponse;

class CalculadoraPegadaController extends Controller
{
    public function store(CalcularPegadaRequest $request, CalculadoraPegadaService $service): JsonResponse
    {
        $resultado = $service->registrar($request->validated());

        return $this->success(
            'Cálculo de pegada de carbono realizado com sucesso.',
            $resultado,
            201,
        );
    }

    public function estatisticas(): JsonResponse
    {
        $media = SimulacaoPegada::query()->avg('emissao_anual_kg');
        $contagem = SimulacaoPegada::query()
            ->selectRaw('nivel_impacto, COUNT(*) as total')
            ->groupBy('nivel_impacto')
            ->pluck('total', 'nivel_impacto');

        return $this->success('Estatísticas de pegada de carbono recuperadas com sucesso.', [
            'total_simulacoes' => SimulacaoPegada::query()->count(),
            'media_emissao_kg' => $media === null ? 0.0 : round((float) $media, 2),
            'distribuicao_impacto' => [
                'baixo' => (int) ($contagem['baixo'] ?? 0),
                'moderado' => (int) ($contagem['moderado'] ?? 0),
                'alto' => (int) ($contagem['alto'] ?? 0),
            ],
        ]);
    }
}
