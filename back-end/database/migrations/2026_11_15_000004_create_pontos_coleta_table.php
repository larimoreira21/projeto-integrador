<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pontos_coleta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_residuo_id')
                ->constrained('categorias_residuos')
                ->restrictOnDelete();
            $table->string('nome_local', 150);
            $table->string('endereco', 255);
            $table->string('bairro', 100);
            $table->string('cidade', 100);
            $table->string('horario_funcionamento', 120);
            $table->boolean('aprovado')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pontos_coleta');
    }
};
