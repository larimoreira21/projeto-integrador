<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perguntas_faq', function (Blueprint $table) {
            $table->id();
            $table->foreignId('respondido_por')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('autor_nome', 120)->nullable();
            $table->text('pergunta');
            $table->text('resposta')->nullable();
            $table->enum('status', ['pendente', 'publicada'])->default('pendente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perguntas_faq');
    }
};
