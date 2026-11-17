<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecursoEducativo extends Model
{
    protected $table = 'recursos_educativos';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'titulo',
        'tipo',
        'categoria',
        'descricao',
        'url_conteudo',
    ];

    public function autor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
