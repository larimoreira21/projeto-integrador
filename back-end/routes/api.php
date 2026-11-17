<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CalculadoraPegadaController;
use App\Http\Controllers\Api\CategoriaResiduoController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\PontoColetaController;
use App\Http\Controllers\Api\RecursoEducativoController;
use App\Http\Controllers\Api\VoluntarioController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::post('/voluntarios', [VoluntarioController::class, 'store']);

Route::get('/categorias-residuos', [CategoriaResiduoController::class, 'index']);
Route::get('/pontos-coleta', [PontoColetaController::class, 'index']);

Route::post('/calculadora-pegada', [CalculadoraPegadaController::class, 'store']);

Route::get('/recursos', [RecursoEducativoController::class, 'index']);

Route::get('/faqs', [FaqController::class, 'index']);
Route::post('/faqs', [FaqController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/voluntarios', [VoluntarioController::class, 'index']);
    Route::delete('/voluntarios/{voluntario}', [VoluntarioController::class, 'destroy']);

    Route::post('/pontos-coleta', [PontoColetaController::class, 'store']);
    Route::put('/pontos-coleta/{pontoColeta}', [PontoColetaController::class, 'update']);
    Route::delete('/pontos-coleta/{pontoColeta}', [PontoColetaController::class, 'destroy']);

    Route::get('/calculadora-pegada/estatisticas', [CalculadoraPegadaController::class, 'estatisticas']);

    Route::post('/recursos', [RecursoEducativoController::class, 'store']);
    Route::put('/recursos/{recursoEducativo}', [RecursoEducativoController::class, 'update']);
    Route::delete('/recursos/{recursoEducativo}', [RecursoEducativoController::class, 'destroy']);

    Route::get('/admin/faqs', [FaqController::class, 'adminIndex']);
    Route::put('/admin/faqs/{perguntaFaq}', [FaqController::class, 'update']);
    Route::delete('/admin/faqs/{perguntaFaq}', [FaqController::class, 'destroy']);
});
