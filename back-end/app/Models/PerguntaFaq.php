<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerguntaFaq extends Model
{
    protected $table = 'perguntas_faq';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'respondido_por',
        'autor_nome',
        'pergunta',
        'resposta',
        'status',
    ];

    public function respondente(): BelongsTo
    {
        return $this->belongsTo(User::class, 'respondido_por');
    }
}
