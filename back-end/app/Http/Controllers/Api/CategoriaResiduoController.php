<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategoriaResiduo;
use Illuminate\Http\JsonResponse;

class CategoriaResiduoController extends Controller
{
    public function index(): JsonResponse
    {
        $categorias = CategoriaResiduo::query()
            ->orderBy('nome')
            ->get(['id', 'nome', 'slug', 'cor_badge']);

        return $this->success('Categorias de resíduos recuperadas com sucesso.', $categorias);
    }
}
