<?php

namespace App\Services;

use App\Models\SimulacaoPegada;
use InvalidArgumentException;

class CalculadoraPegadaService
{
    public const FATOR_ENERGIA_KWH = 0.085;

    /** @var array<string, float> */
    public const FATORES_TRANSPORTE = [
        'carro_combustao' => 0.21,
        'moto' => 0.11,
        'transporte_publico' => 0.05,
        'bicicleta_caminhada' => 0.0,
    ];

    /** @var array<string, float> */
    public const FATORES_RESIDUOS = [
        'sempre' => 100.0,
        'as_vezes' => 250.0,
        'nunca' => 450.0,
    ];

    /**
     * @param  array{transporte_principal: string, km_semanais: float|int|string, kwh_mensal: float|int|string, recicla_residuos: string}  $dados
     * @return array{
     *     transporte_kg: float,
     *     energia_kg: float,
     *     residuos_kg: float,
     *     emissao_anual_kg: float,
     *     nivel_impacto: string,
     *     recomendacoes: list<string>
     * }
     */
    public function calcular(array $dados): array
    {
        $transporte = $dados['transporte_principal'];
        $recicla = $dados['recicla_residuos'];

        if (! array_key_exists($transporte, self::FATORES_TRANSPORTE)) {
            throw new InvalidArgumentException('Transporte principal inválido.');
        }

        if (! array_key_exists($recicla, self::FATORES_RESIDUOS)) {
            throw new InvalidArgumentException('Hábito de reciclagem inválido.');
        }

        $transporteKg = round(((float) $dados['km_semanais']) * 52 * self::FATORES_TRANSPORTE[$transporte], 2);
        $energiaKg = round(((float) $dados['kwh_mensal']) * 12 * self::FATOR_ENERGIA_KWH, 2);
        $residuosKg = round(self::FATORES_RESIDUOS[$recicla], 2);
        $emissao = round($transporteKg + $energiaKg + $residuosKg, 2);

        return [
            'transporte_kg' => $transporteKg,
            'energia_kg' => $energiaKg,
            'residuos_kg' => $residuosKg,
            'emissao_anual_kg' => $emissao,
            'nivel_impacto' => $this->classificar($emissao),
            'recomendacoes' => $this->recomendacoes($transporte, $recicla, $transporteKg, $energiaKg, $residuosKg),
        ];
    }

    /**
     * Calcula a pegada e persiste o registro em simulacoes_pegada.
     *
     * @param  array{transporte_principal: string, km_semanais: float|int|string, kwh_mensal: float|int|string, recicla_residuos: string}  $dados
     * @return array{
     *     id: int,
     *     emissao_anual_kg: float,
     *     nivel_impacto: string,
     *     detalhamento: array{transporte_kg: float, energia_kg: float, residuos_kg: float},
     *     recomendacoes: list<string>
     * }
     */
    public function registrar(array $dados): array
    {
        $resultado = $this->calcular($dados);

        $simulacao = SimulacaoPegada::query()->create([
            'transporte_principal' => $dados['transporte_principal'],
            'km_semanais' => $dados['km_semanais'],
            'kwh_mensal' => $dados['kwh_mensal'],
            'recicla_residuos' => $dados['recicla_residuos'],
            'emissao_anual_kg' => $resultado['emissao_anual_kg'],
            'nivel_impacto' => $resultado['nivel_impacto'],
            'recomendacoes' => $resultado['recomendacoes'],
        ]);

        return [
            'id' => $simulacao->id,
            'emissao_anual_kg' => $resultado['emissao_anual_kg'],
            'nivel_impacto' => $resultado['nivel_impacto'],
            'detalhamento' => [
                'transporte_kg' => $resultado['transporte_kg'],
                'energia_kg' => $resultado['energia_kg'],
                'residuos_kg' => $resultado['residuos_kg'],
            ],
            'recomendacoes' => $resultado['recomendacoes'],
        ];
    }

    private function classificar(float $emissaoAnualKg): string
    {
        if ($emissaoAnualKg < 1500) {
            return 'baixo';
        }

        if ($emissaoAnualKg <= 3500) {
            return 'moderado';
        }

        return 'alto';
    }

    /**
     * @return list<string>
     */
    private function recomendacoes(
        string $transporte,
        string $recicla,
        float $transporteKg,
        float $energiaKg,
        float $residuosKg,
    ): array {
        $ofensores = [
            'transporte' => $transporteKg,
            'energia' => $energiaKg,
            'residuos' => $residuosKg,
        ];

        arsort($ofensores);

        $dicas = [];

        foreach (array_keys($ofensores) as $ofensor) {
            $dicas = array_merge($dicas, match ($ofensor) {
                'transporte' => $this->dicasTransporte($transporte),
                'energia' => [
                    'Reduza o consumo de energia: troque lâmpadas por LED e desligue aparelhos em standby.',
                    'Aproveite a luz natural e prefira equipamentos com selo de eficiência energética.',
                ],
                'residuos' => $this->dicasResiduos($recicla),
                default => [],
            });
        }

        $dicas[] = 'Participe de mutirões de arborização: árvores urbanas ajudam a compensar emissões de CO₂.';

        $unicas = [];

        foreach ($dicas as $dica) {
            if (! in_array($dica, $unicas, true)) {
                $unicas[] = $dica;
            }
        }

        return array_slice($unicas, 0, 4);
    }

    /**
     * @return list<string>
     */
    private function dicasTransporte(string $transporte): array
    {
        return match ($transporte) {
            'carro_combustao' => [
                'Substitua trajetos curtos de carro por bicicleta ou transporte público.',
                'Organize caronas e combine deslocamentos para reduzir quilômetros rodados por semana.',
            ],
            'moto' => [
                'Para distâncias curtas, prefira bicicleta ou caminhada no lugar da moto.',
                'Planeje rotas e evite acelerações bruscas para reduzir o consumo de combustível.',
            ],
            'transporte_publico' => [
                'Mantenha o transporte público como escolha principal e complete trechos curtos a pé.',
                'Evite deslocamentos motorizados individuais quando o itinerário permitir caminhada.',
            ],
            default => [
                'Continue priorizando bicicleta e caminhada — seu deslocamento já evita emissões de combustíveis fósseis.',
                'Incentive colegas e vizinhos a substituir trajetos curtos de carro por caminhada.',
            ],
        };
    }

    /**
     * @return list<string>
     */
    private function dicasResiduos(string $recicla): array
    {
        return match ($recicla) {
            'sempre' => [
                'Mantenha a separação de recicláveis e encaminhe orgânicos para compostagem.',
            ],
            'as_vezes' => [
                'Separe resíduos recicláveis regularmente para reduzir emissões em aterros.',
                'Defina um dia fixo da semana para separar recicláveis, orgânicos e rejeitos.',
            ],
            default => [
                'Comece separando recicláveis e óleo de cozinha: o descarte correto reduz emissões em aterros.',
                'Separe resíduos recicláveis regularmente para reduzir emissões em aterros.',
            ],
        };
    }
}
