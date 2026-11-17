<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRecursoEducativoRequest;
use App\Http\Requests\UpdateRecursoEducativoRequest;
use App\Models\RecursoEducativo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecursoEducativoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $consulta = RecursoEducativo::query()->orderByDesc('created_at')->orderByDesc('id');

        if ($request->filled('tipo')) {
            $consulta->where('tipo', $request->string('tipo')->toString());
        }

        if ($request->filled('categoria')) {
            $consulta->where('categoria', $request->string('categoria')->toString());
        }

        return $this->success('Recursos educativos recuperados com sucesso.', $consulta->get());
    }

    public function store(StoreRecursoEducativoRequest $request): JsonResponse
    {
        $recurso = RecursoEducativo::query()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return $this->success('Recurso educativo cadastrado com sucesso.', $recurso, 201);
    }

    public function update(UpdateRecursoEducativoRequest $request, RecursoEducativo $recursoEducativo): JsonResponse
    {
        $recursoEducativo->update($request->validated());

        return $this->success('Recurso educativo atualizado com sucesso.', $recursoEducativo);
    }

    public function destroy(RecursoEducativo $recursoEducativo): JsonResponse
    {
        $recursoEducativo->delete();

        return $this->success('Recurso educativo removido com sucesso.');
    }
}
