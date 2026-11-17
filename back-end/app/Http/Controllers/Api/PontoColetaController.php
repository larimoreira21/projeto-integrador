<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePontoColetaRequest;
use App\Http\Requests\UpdatePontoColetaRequest;
use App\Models\PontoColeta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PontoColetaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $consulta = PontoColeta::query()
            ->with('categoriaResiduo')
            ->where('aprovado', true)
            ->orderBy('nome_local');

        if ($request->filled('categoria_residuo_id')) {
            $consulta->where('categoria_residuo_id', $request->integer('categoria_residuo_id'));
        }

        if ($request->filled('bairro')) {
            $consulta->where('bairro', $request->string('bairro')->toString());
        }

        if ($request->filled('busca')) {
            $termo = '%'.$this->escaparLike($request->string('busca')->toString()).'%';
            $consulta->where(function ($query) use ($termo) {
                $query->where('nome_local', 'like', $termo)
                    ->orWhere('endereco', 'like', $termo)
                    ->orWhere('bairro', 'like', $termo)
                    ->orWhere('cidade', 'like', $termo);
            });
        }

        return $this->success('Pontos de coleta recuperados com sucesso.', $consulta->get());
    }

    public function store(StorePontoColetaRequest $request): JsonResponse
    {
        $ponto = PontoColeta::query()->create([
            ...$request->validated(),
            'aprovado' => true,
        ]);

        $ponto->load('categoriaResiduo');

        return $this->success('Ponto de coleta cadastrado com sucesso.', $ponto, 201);
    }

    public function update(UpdatePontoColetaRequest $request, PontoColeta $pontoColeta): JsonResponse
    {
        $pontoColeta->update($request->validated());
        $pontoColeta->load('categoriaResiduo');

        return $this->success('Ponto de coleta atualizado com sucesso.', $pontoColeta);
    }

    public function destroy(PontoColeta $pontoColeta): JsonResponse
    {
        $pontoColeta->delete();

        return $this->success('Ponto de coleta removido com sucesso.');
    }

    private function escaparLike(string $termo): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $termo);
    }
}
