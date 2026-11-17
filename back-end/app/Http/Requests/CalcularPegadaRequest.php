<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalcularPegadaRequest extends FormRequest
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
            'transporte_principal' => ['required', 'in:carro_combustao,moto,transporte_publico,bicicleta_caminhada'],
            'km_semanais' => ['required', 'numeric', 'min:0', 'max:10000'],
            'kwh_mensal' => ['required', 'numeric', 'min:0', 'max:50000'],
            'recicla_residuos' => ['required', 'in:sempre,as_vezes,nunca'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'transporte_principal.required' => 'O transporte principal é obrigatório.',
            'transporte_principal.in' => 'O transporte principal informado não é válido.',
            'km_semanais.required' => 'A quilometragem semanal é obrigatória.',
            'km_semanais.numeric' => 'A quilometragem semanal deve ser numérica.',
            'km_semanais.min' => 'A quilometragem semanal não pode ser negativa.',
            'km_semanais.max' => 'A quilometragem semanal não pode ser maior que :max.',
            'kwh_mensal.required' => 'O consumo mensal de energia é obrigatório.',
            'kwh_mensal.numeric' => 'O consumo mensal de energia deve ser numérico.',
            'kwh_mensal.min' => 'O consumo mensal de energia não pode ser negativo.',
            'kwh_mensal.max' => 'O consumo mensal de energia não pode ser maior que :max.',
            'recicla_residuos.required' => 'O hábito de reciclagem é obrigatório.',
            'recicla_residuos.in' => 'O hábito de reciclagem deve ser sempre, as_vezes ou nunca.',
        ];
    }
}
