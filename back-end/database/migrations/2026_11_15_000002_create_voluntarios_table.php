<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voluntarios', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 120);
            $table->string('email', 150)->unique();
            $table->string('telefone', 20)->nullable();
            $table->string('bairro', 100);
            $table->string('cidade', 100);
            $table->enum('perfil', ['cidadao', 'educador', 'voluntario'])->default('cidadao');
            $table->string('area_interesse', 150);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voluntarios');
    }
};
