<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voluntario extends Model
{
    protected $table = 'voluntarios';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'bairro',
        'cidade',
        'perfil',
        'area_interesse',
    ];
}
