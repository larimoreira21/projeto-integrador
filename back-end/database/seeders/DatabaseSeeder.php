<?php

namespace Database\Seeders;

use App\Models\CategoriaResiduo;
use App\Models\PerguntaFaq;
use App\Models\PontoColeta;
use App\Models\RecursoEducativo;
use App\Models\SimulacaoPegada;
use App\Models\User;
use App\Models\Voluntario;
use App\Services\CalculadoraPegadaService;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = $this->seedAdmin();
        $categorias = $this->seedCategorias();
        $this->seedPontosColeta($categorias);
        $this->seedRecursos($admin);
        $this->seedFaqs($admin);
        $this->seedVoluntarios();
        $this->seedSimulacoes();
    }

    private function seedAdmin(): User
    {
        return User::query()->updateOrCreate(
            ['email' => 'admin@climasustentavel.org'],
            [
                'name' => 'Administrador Clima Sustentável',
                'password' => 'Admin@123',
                'role' => 'admin',
            ],
        );
    }

    /**
     * @return array<string, CategoriaResiduo>
     */
    private function seedCategorias(): array
    {
        $itens = [
            ['nome' => 'Recicláveis', 'slug' => 'reciclaveis', 'cor_badge' => '#1E5631'],
            ['nome' => 'Eletrônicos', 'slug' => 'eletronicos', 'cor_badge' => '#0D7377'],
            ['nome' => 'Óleo de Cozinha', 'slug' => 'oleo-de-cozinha', 'cor_badge' => '#C4A35A'],
            ['nome' => 'Pilhas e Baterias', 'slug' => 'pilhas-e-baterias', 'cor_badge' => '#B85C38'],
            ['nome' => 'Orgânicos', 'slug' => 'organicos', 'cor_badge' => '#2E7D32'],
        ];

        $categorias = [];

        foreach ($itens as $item) {
            $categorias[$item['slug']] = CategoriaResiduo::query()->updateOrCreate(
                ['slug' => $item['slug']],
                $item,
            );
        }

        return $categorias;
    }

    /**
     * @param  array<string, CategoriaResiduo>  $categorias
     */
    private function seedPontosColeta(array $categorias): void
    {
        $pontos = [
            ['categoria' => 'reciclaveis', 'nome_local' => 'Ecoponto Municipal do Centro', 'endereco' => 'Rua Visconde do Rio Branco, 215', 'bairro' => 'Centro', 'cidade' => 'Taubaté', 'horario_funcionamento' => 'Seg a Sáb, das 08h às 17h'],
            ['categoria' => 'eletronicos', 'nome_local' => 'Ecoponto Jardim das Nações', 'endereco' => 'Av. das Palmeiras, 450', 'bairro' => 'Jardim das Nações', 'cidade' => 'Taubaté', 'horario_funcionamento' => 'Seg a Sex, das 09h às 16h'],
            ['categoria' => 'oleo-de-cozinha', 'nome_local' => 'Coleta de Óleo do Mercado Municipal', 'endereco' => 'Praça Santa Terezinha, 40', 'bairro' => 'Centro', 'cidade' => 'Taubaté', 'horario_funcionamento' => 'Ter a Sáb, das 08h às 13h'],
            ['categoria' => 'pilhas-e-baterias', 'nome_local' => 'Coletor de Pilhas da Independência', 'endereco' => 'Av. Independência, 1020', 'bairro' => 'Independência', 'cidade' => 'Taubaté', 'horario_funcionamento' => 'Seg a Sex, das 08h às 18h'],
            ['categoria' => 'organicos', 'nome_local' => 'Composteira Comunitária do Parque Ecológico', 'endereco' => 'Rua das Hortênsias, 35', 'bairro' => 'Jardim Santa Clara', 'cidade' => 'Taubaté', 'horario_funcionamento' => 'Sáb e Dom, das 08h às 12h'],
            ['categoria' => 'reciclaveis', 'nome_local' => 'Ecoponto do Bosque da Saúde', 'endereco' => 'Av. Charles Schnneider, 2100', 'bairro' => 'Esplanada', 'cidade' => 'Taubaté', 'horario_funcionamento' => 'Seg a Sáb, das 08h às 17h'],
        ];

        foreach ($pontos as $ponto) {
            PontoColeta::query()->updateOrCreate(
                ['nome_local' => $ponto['nome_local'], 'cidade' => $ponto['cidade']],
                [
                    'categoria_residuo_id' => $categorias[$ponto['categoria']]->id,
                    'nome_local' => $ponto['nome_local'],
                    'endereco' => $ponto['endereco'],
                    'bairro' => $ponto['bairro'],
                    'cidade' => $ponto['cidade'],
                    'horario_funcionamento' => $ponto['horario_funcionamento'],
                    'aprovado' => true,
                ],
            );
        }
    }

    private function seedRecursos(User $admin): void
    {
        $recursos = [
            ['titulo' => 'Cartilha de Coleta Seletiva em Casa', 'tipo' => 'guia', 'categoria' => 'Resíduos', 'descricao' => 'Passo a passo para separar recicláveis, orgânicos e rejeitos no dia a dia, com destinação correta em Taubaté.', 'url_conteudo' => 'https://climasustentavel.org/guias/coleta-seletiva'],
            ['titulo' => 'Como Reduzir a Conta de Luz e as Emissões', 'tipo' => 'guia', 'categoria' => 'Energia', 'descricao' => 'Guia prático de eficiência energética: iluminação LED, uso consciente de eletrodomésticos e redução de kWh mensais.', 'url_conteudo' => 'https://climasustentavel.org/guias/energia-em-casa'],
            ['titulo' => 'Mobilidade ativa no Vale do Paraíba', 'tipo' => 'video', 'categoria' => 'Transporte', 'descricao' => 'Vídeo educativo sobre como substituir trajetos curtos de carro por bicicleta, caminhada e transporte público.', 'url_conteudo' => 'https://climasustentavel.org/videos/mobilidade-sustentavel'],
            ['titulo' => 'Mutirão de arborização urbana', 'tipo' => 'video', 'categoria' => 'Arborização', 'descricao' => 'Registro de um mutirão de plantio e orientações para cuidar de mudas em praças e calçadas.', 'url_conteudo' => 'https://climasustentavel.org/videos/arborizacao-urbana'],
        ];

        foreach ($recursos as $recurso) {
            RecursoEducativo::query()->updateOrCreate(
                ['titulo' => $recurso['titulo']],
                [...$recurso, 'user_id' => $admin->id],
            );
        }
    }

    private function seedFaqs(User $admin): void
    {
        $publicadas = [
            ['autor_nome' => 'Ana Costa', 'pergunta' => 'Onde posso descartar óleo de cozinha usado?', 'resposta' => 'Leve o óleo frio, em garrafa PET fechada, a um ecoponto de óleo. Nunca despeje na pia: o descarte incorreto contamina a água e sobrecarrega o tratamento de esgoto.'],
            ['autor_nome' => 'João Pedro', 'pergunta' => 'Pilhas e baterias podem ir para o lixo comum?', 'resposta' => 'Não. Pilhas e baterias contêm metais pesados e devem ir para coletores específicos, como o ponto da Avenida Independência ou ecopontos de eletrônicos.'],
            ['autor_nome' => 'Larissa Mendes', 'pergunta' => 'Como a reciclagem reduz a pegada de carbono?', 'resposta' => 'Reciclar diminui a extração de matéria-prima e a energia da produção industrial, além de evitar emissões de metano em aterros. Separar sempre reduz a parcela de resíduos da sua pegada.'],
            ['autor_nome' => 'Carlos Lima', 'pergunta' => 'O que é a ODS 13 e como a comunidade pode contribuir?', 'resposta' => 'A ODS 13 trata da ação contra a mudança global do clima. A comunidade contribui com educação ambiental, coleta seletiva, mobilidade de baixa emissão e mutirões de arborização.'],
        ];

        foreach ($publicadas as $faq) {
            PerguntaFaq::query()->updateOrCreate(
                ['pergunta' => $faq['pergunta']],
                [...$faq, 'status' => 'publicada', 'respondido_por' => $admin->id],
            );
        }

        $pendentes = [
            ['autor_nome' => 'Beatriz Nogueira', 'pergunta' => 'Existe coleta de eletrônicos no bairro Esplanada?'],
            ['autor_nome' => 'Rafael Souza', 'pergunta' => 'Posso compostar resíduos de poda em casa?'],
        ];

        foreach ($pendentes as $faq) {
            PerguntaFaq::query()->firstOrCreate(
                ['pergunta' => $faq['pergunta']],
                [...$faq, 'resposta' => null, 'status' => 'pendente', 'respondido_por' => null],
            );
        }
    }

    private function seedVoluntarios(): void
    {
        $voluntarios = [
            ['nome' => 'Ana Costa', 'email' => 'ana.costa@email.com', 'telefone' => '(12) 98888-1001', 'bairro' => 'Centro', 'cidade' => 'Taubaté', 'perfil' => 'cidadao', 'area_interesse' => 'Mutirão de Plantio'],
            ['nome' => 'Mariana Silva', 'email' => 'mariana.silva@email.com', 'telefone' => '(12) 99999-0000', 'bairro' => 'Jardim das Nações', 'cidade' => 'Taubaté', 'perfil' => 'educador', 'area_interesse' => 'Oficinas Educativas'],
            ['nome' => 'Pedro Almeida', 'email' => 'pedro.almeida@email.com', 'telefone' => null, 'bairro' => 'Independência', 'cidade' => 'Taubaté', 'perfil' => 'voluntario', 'area_interesse' => 'Coleta Seletiva'],
        ];

        foreach ($voluntarios as $voluntario) {
            Voluntario::query()->updateOrCreate(
                ['email' => $voluntario['email']],
                $voluntario,
            );
        }
    }

    private function seedSimulacoes(): void
    {
        if (SimulacaoPegada::query()->exists()) {
            return;
        }

        $service = new CalculadoraPegadaService();

        $service->registrar([
            'transporte_principal' => 'bicicleta_caminhada',
            'km_semanais' => 20,
            'kwh_mensal' => 50,
            'recicla_residuos' => 'sempre',
        ]);

        $service->registrar([
            'transporte_principal' => 'carro_combustao',
            'km_semanais' => 120,
            'kwh_mensal' => 210,
            'recicla_residuos' => 'as_vezes',
        ]);

        $service->registrar([
            'transporte_principal' => 'carro_combustao',
            'km_semanais' => 400,
            'kwh_mensal' => 500,
            'recicla_residuos' => 'nunca',
        ]);
    }
}
