<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFaqRequest extends FormRequest
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
            'autor_nome' => ['sometimes', 'nullable', 'string', 'max:120'],
            'pergunta' => ['sometimes', 'required', 'string', 'min:10', 'max:1000'],
            'resposta' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'required', 'in:pendente,publicada'],
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
            'status.required' => 'O status é obrigatório.',
            'status.in' => 'O status deve ser pendente ou publicada.',
        ];
    }
}
