<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecursoEducativoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:180'],
            'tipo' => ['required', 'in:guia,video'],
            'categoria' => ['required', 'string', 'max:80'],
            'descricao' => ['required', 'string'],
            'url_conteudo' => ['required', 'url', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'titulo.required' => 'O título é obrigatório.',
            'titulo.max' => 'O título deve ter no máximo :max caracteres.',
            'tipo.required' => 'O tipo do recurso é obrigatório.',
            'tipo.in' => 'O tipo deve ser guia ou video.',
            'categoria.required' => 'A categoria é obrigatória.',
            'categoria.max' => 'A categoria deve ter no máximo :max caracteres.',
            'descricao.required' => 'A descrição é obrigatória.',
            'url_conteudo.required' => 'A URL do conteúdo é obrigatória.',
            'url_conteudo.url' => 'Informe uma URL válida para o conteúdo.',
            'url_conteudo.max' => 'A URL do conteúdo deve ter no máximo :max caracteres.',
        ];
    }
}
