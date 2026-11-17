<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePontoColetaRequest extends FormRequest
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
            'aprovado' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'categoria_residuo_id.required' => 'A categoria de resíduo é obrigatória.',
            'categoria_residuo_id.exists' => 'A categoria de resíduo informada não existe.',
            'nome_local.required' => 'O nome do local é obrigatório.',
            'endereco.required' => 'O endereço é obrigatório.',
            'bairro.required' => 'O bairro é obrigatório.',
            'cidade.required' => 'A cidade é obrigatória.',
            'horario_funcionamento.required' => 'O horário de funcionamento é obrigatório.',
            'aprovado.boolean' => 'O campo aprovado deve ser verdadeiro ou falso.',
        ];
    }
}
