<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVoluntarioRequest extends FormRequest
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
            'nome' => ['required', 'string', 'min:3', 'max:120'],
            'email' => ['required', 'email', 'max:150', 'unique:voluntarios,email'],
            'telefone' => ['nullable', 'string', 'max:20'],
            'bairro' => ['required', 'string', 'max:100'],
            'cidade' => ['required', 'string', 'max:100'],
            'perfil' => ['required', 'in:cidadao,educador,voluntario'],
            'area_interesse' => ['required', 'string', 'max:150'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nome.required' => 'O nome é obrigatório.',
            'nome.min' => 'O nome deve ter no mínimo :min caracteres.',
            'nome.max' => 'O nome deve ter no máximo :max caracteres.',
            'email.required' => 'O e-mail é obrigatório.',
            'email.email' => 'Informe um e-mail válido.',
            'email.unique' => 'Este e-mail já está cadastrado.',
            'telefone.max' => 'O telefone deve ter no máximo :max caracteres.',
            'bairro.required' => 'O bairro é obrigatório.',
            'bairro.max' => 'O bairro deve ter no máximo :max caracteres.',
            'cidade.required' => 'A cidade é obrigatória.',
            'cidade.max' => 'A cidade deve ter no máximo :max caracteres.',
            'perfil.required' => 'O perfil é obrigatório.',
            'perfil.in' => 'O perfil deve ser cidadao, educador ou voluntario.',
            'area_interesse.required' => 'A área de interesse é obrigatória.',
            'area_interesse.max' => 'A área de interesse deve ter no máximo :max caracteres.',
        ];
    }
}
