<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PontoColeta extends Model
{
    protected $table = 'pontos_coleta';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'categoria_residuo_id',
        'nome_local',
        'endereco',
        'bairro',
        'cidade',
        'horario_funcionamento',
        'aprovado',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'aprovado' => 'boolean',
        ];
    }

    public function categoriaResiduo(): BelongsTo
    {
        return $this->belongsTo(CategoriaResiduo::class);
    }
}
