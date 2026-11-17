<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('simulacoes_pegada', function (Blueprint $table) {
            $table->id();
            $table->enum('transporte_principal', [
                'carro_combustao',
                'moto',
                'transporte_publico',
                'bicicleta_caminhada',
            ]);
            $table->decimal('km_semanais', 8, 2);
            $table->decimal('kwh_mensal', 8, 2);
            $table->enum('recicla_residuos', ['sempre', 'as_vezes', 'nunca']);
            $table->decimal('emissao_anual_kg', 10, 2);
            $table->enum('nivel_impacto', ['baixo', 'moderado', 'alto']);
            $table->json('recomendacoes');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('simulacoes_pegada');
    }
};
