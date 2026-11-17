<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVoluntarioRequest;
use App\Models\Voluntario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VoluntarioController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $consulta = Voluntario::query()
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        if ($request->filled('perfil')) {
            $consulta->where('perfil', $request->string('perfil')->toString());
        }

        return $this->success('Voluntários recuperados com sucesso.', $consulta->get());
    }

    public function store(StoreVoluntarioRequest $request): JsonResponse
    {
        $voluntario = Voluntario::query()->create($request->validated());

        return $this->success('Voluntário cadastrado com sucesso.', $voluntario, 201);
    }

    public function destroy(Voluntario $voluntario): JsonResponse
    {
        $voluntario->delete();

        return $this->success('Voluntário removido com sucesso.');
    }
}
