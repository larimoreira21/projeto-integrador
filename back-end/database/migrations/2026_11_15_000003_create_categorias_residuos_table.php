<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categorias_residuos', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 80)->unique();
            $table->string('slug', 80)->unique();
            $table->string('cor_badge', 20)->default('#1E5631');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categorias_residuos');
    }
};
