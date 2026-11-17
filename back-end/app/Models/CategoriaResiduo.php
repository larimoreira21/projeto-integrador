<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaResiduo extends Model
{
    protected $table = 'categorias_residuos';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'nome',
        'slug',
        'cor_badge',
    ];

    public function pontosColeta(): HasMany
    {
        return $this->hasMany(PontoColeta::class);
    }
}
