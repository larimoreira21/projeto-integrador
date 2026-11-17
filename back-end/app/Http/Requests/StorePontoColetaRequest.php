<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePontoColetaRequest extends FormRequest
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
            'categoria_residuo_id' => ['required', 'integer', 'exists:categorias_residuos,id'],
            'nome_local' => ['required', 'string', 'max:150'],
            'endereco' => ['required', 'string', 'max:255'],
            'bairro' => ['required', 'string', 'max:100'],
            'cidade' => ['required', 'string', 'max:100'],
            'horario_funcionamento' => ['required', 'string', 'max:120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'categoria_residuo_id.required' => 'A categoria de resíduo é obrigatória.',
            'categoria_residuo_id.integer' => 'A categoria de resíduo deve ser um identificador válido.',
            'categoria_residuo_id.exists' => 'A categoria de resíduo informada não existe.',
            'nome_local.required' => 'O nome do local é obrigatório.',
            'nome_local.max' => 'O nome do local deve ter no máximo :max caracteres.',
            'endereco.required' => 'O endereço é obrigatório.',
            'endereco.max' => 'O endereço deve ter no máximo :max caracteres.',
            'bairro.required' => 'O bairro é obrigatório.',
            'bairro.max' => 'O bairro deve ter no máximo :max caracteres.',
            'cidade.required' => 'A cidade é obrigatória.',
            'cidade.max' => 'A cidade deve ter no máximo :max caracteres.',
            'horario_funcionamento.required' => 'O horário de funcionamento é obrigatório.',
            'horario_funcionamento.max' => 'O horário de funcionamento deve ter no máximo :max caracteres.',
        ];
    }
}
