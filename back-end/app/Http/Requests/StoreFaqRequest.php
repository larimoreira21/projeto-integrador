<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFaqRequest extends FormRequest
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
            'autor_nome' => ['nullable', 'string', 'max:120'],
            'pergunta' => ['required', 'string', 'min:10', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'autor_nome.max' => 'O nome do autor deve ter no máximo :max caracteres.',
            'pergunta.required' => 'A pergunta é obrigatória.',
            'pergunta.min' => 'A pergunta deve ter no mínimo :min caracteres.',
            'pergunta.max' => 'A pergunta deve ter no máximo :max caracteres.',
        ];
    }
}
