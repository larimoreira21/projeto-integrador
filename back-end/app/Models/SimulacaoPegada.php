<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SimulacaoPegada extends Model
{
    protected $table = 'simulacoes_pegada';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'transporte_principal',
        'km_semanais',
        'kwh_mensal',
        'recicla_residuos',
        'emissao_anual_kg',
        'nivel_impacto',
        'recomendacoes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'km_semanais' => 'decimal:2',
            'kwh_mensal' => 'decimal:2',
            'emissao_anual_kg' => 'decimal:2',
            'recomendacoes' => 'array',
        ];
    }
}
