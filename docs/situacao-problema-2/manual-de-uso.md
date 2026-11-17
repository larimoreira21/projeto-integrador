# Manual de uso — Clima Sustentável

Guia para instalar o projeto, usar o site como visitante e operar o painel administrativo. Os marcadores `[Inserir Print …]` indicam onde colocar a captura de tela do sistema em execução.

---

## 1. Instalação e configuração

### 1.1 O que precisa estar instalado

| Ferramenta | Versão usada no projeto | Para que serve |
| --- | --- | --- |
| PHP | 8.2 ou superior, com `pdo_mysql`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `openssl` e `sqlite` | API Laravel. O `sqlite` só entra nos testes. |
| Composer | 2 | Dependências do back-end |
| MySQL | 8, ou MariaDB compatível | Banco `clima_sustentavel` |
| Node.js | 18 ou superior | Site React |
| npm | o que acompanha o Node | Dependências do front-end |

Confira no terminal:

```bash
php -v
composer -V
node -v
npm -v
mysql --version
```

### 1.2 Back-end

Abra um terminal na pasta `back-end/`.

```bash
composer install
cp .env.example .env
php artisan key:generate
```

O Composer 2.9 ou mais novo pode recusar o Laravel 11 por aviso de segurança do Packagist. O `composer.json` deste projeto desliga esse bloqueio (`policy.advisories.block`), porque a disciplina pede Laravel 11. Não publique a API na internet sem revisar essa escolha.

Crie o banco. No exemplo local, o usuário é `root` e a senha está vazia, como no `.env.example`:

```sql
CREATE DATABASE clima_sustentavel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Se o seu MySQL usar outro usuário ou senha, ajuste `DB_DATABASE`, `DB_USERNAME` e `DB_PASSWORD` no `.env` antes de migrar.

```bash
php artisan migrate --seed
php artisan serve
```

A API fica em http://localhost:8000. Deixe esse terminal aberto.

O `--seed` grava o administrador, as cinco categorias de resíduo, ecopontos de exemplo em Taubaté, guias, vídeos, perguntas do FAQ, três inscrições e três simulações da calculadora. Pode rodar de novo: os registros já existentes não são duplicados.

Administrador criado pelo seed:

- E-mail: `admin@climasustentavel.org`
- Senha: `Admin@123`

A senha é gravada como hash. Troque `Admin@123` antes de qualquer publicação.

`php artisan migrate:fresh --seed` apaga os dados e recria tabelas e conteúdo inicial. `migrate:fresh` sem `--seed` deixa o banco vazio, sem o administrador.

### 1.3 Front-end

Em outro terminal, na pasta `front-end/`:

```bash
npm install
npm run dev
```

O site abre em http://localhost:5173. A API precisa estar no ar. O endereço usado pelo Axios é `http://localhost:8000/api`. Para apontar outro servidor, crie `front-end/.env` com:

```bash
VITE_API_URL=http://localhost:8000/api
```

Reinicie o `npm run dev` depois de mudar esse arquivo.

### 1.4 Testes automatizados

Com o terminal na pasta `back-end/`:

```bash
php artisan test
```

A suíte usa SQLite em memória e não mexe no MySQL. O resultado esperado é 14 testes passando. O detalhe de cada arquivo está em `docs/situacao-problema-3/evidencias-testes-unitarios.md`.

---

## 2. Manual do visitante

O visitante não cria conta e não entra no painel. Cidadão, educador e voluntário usam o mesmo site. A diferença entre eles aparece só no formulário de inscrição.

### 2.1 Página inicial

1. Abra http://localhost:5173.
2. O menu traz Educação, Mitigação, Ação Climática, Recursos, Sobre, Pontos de Coleta, Calculadora e Área Admin.
3. No celular, o menu fica no ícone de três linhas, no canto direito.

> **[Inserir Print 01 — Tela inicial e banner ODS 13]**

A abertura mostra o título sobre educação e mitigação e o selo da ODS 13. Os botões dessa faixa descem até os materiais e até a seção de ação climática.

Em **Boas Práticas na Mitigação das Mudanças Climáticas** há quatro cartões: Reduza Emissões, Poupe Energia, Plante Árvores e Consumo Consciente.

> **[Inserir Print 02 — Cartões de boas práticas]**

O botão **Ver Todas as Boas Práticas** abre mais três dicas (recicláveis, descarte de óleo/pilhas/eletrônicos e água). **Ocultar dicas extras** fecha esse bloco.

> **[Inserir Print 03 — Dicas extras abertas]**

A seção **Ação Climática** numera quatro passos: 1 Entenda, 2 Reduza, 3 Engaje e 4 Preserve.

> **[Inserir Print 04 — Os quatro passos da ação climática]**

### 2.2 Inscrição: Quero Me Engajar e Sou Educador / Voluntário

No fim da página inicial há dois botões.

**Quero Me Engajar** abre o formulário com o perfil fixo em Cidadão. Preencha:

- Nome (mínimo de 3 caracteres)
- E-mail
- Telefone, se quiser
- Bairro
- Cidade
- Área de interesse: Mutirão de Plantio, Oficinas Educativas, Coleta Seletiva, Arborização ou Educação Ambiental. Também dá para digitar outro texto.

> **[Inserir Print 05 — Modal Quero me engajar]**

**Sou Educador / Voluntário** abre o mesmo formulário, com a lista Perfil em Educador ou Voluntário.

> **[Inserir Print 06 — Modal de educador ou voluntário]**

Clique em **Enviar cadastro**. Se der certo, a janela mostra “Voluntário cadastrado com sucesso.” e o texto de agradecimento. **Fechar** ou um clique fora da janela encerra o modal. **Cancelar** fecha sem enviar.

> **[Inserir Print 07 — Confirmação da inscrição]**

Essa inscrição não cria login. A pessoa continua navegando como visitante. O administrador vê o cadastro na aba Visão geral e voluntários.

Se o e-mail já existir, o campo mostra “Este e-mail já está cadastrado.” e nada é gravado de novo.

> **[Inserir Print 08 — E-mail já cadastrado]**

### 2.3 Pontos de coleta

1. No menu, clique em **Pontos de Coleta**. A rota é `/pontos-coleta`.
2. A página carrega os tipos de resíduo e os ecopontos aprovados.
3. Os cartões mostram nome, endereço, bairro, cidade, horário e a categoria, com a cor cadastrada.

> **[Inserir Print 09 — Lista de ecopontos]**

Para filtrar:

- clique em um tipo (Recicláveis, Eletrônicos, Óleo de Cozinha, Pilhas e Baterias, Orgânicos) ou em Todos;
- ou digite bairro, rua ou nome no campo “Buscar por bairro, endereço ou nome do local” e envie a busca.

> **[Inserir Print 10 — Filtro por tipo de resíduo]**

Se nada combinar, a página diz: “Nenhum ecoponto encontrado para esse filtro. Tente outro tipo de resíduo ou outro bairro.”

> **[Inserir Print 11 — Busca de ecoponto sem resultado]**

Não há formulário público para cadastrar um ponto novo. Isso é de propósito: um visitante não publica um local para toda a comunidade. O cadastro fica no painel, descrito na seção 3.

O rodapé **Descarte Seguro** também abre esta página.

### 2.4 Calculadora de pegada de carbono

1. No menu, clique em **Calculadora** (`/calculadora`).
2. Escolha o meio de transporte: Carro a combustão, Moto, Transporte público ou Bicicleta ou caminhada.
3. Informe os quilômetros por semana (de 0 a 10000) e a energia do mês em kWh (de 0 a 50000).
4. Marque com que frequência você recicla: Sempre separo os recicláveis, Às vezes ou Nunca.
5. Clique em **Calcular pegada**.

> **[Inserir Print 12 — Formulário da calculadora]**

A conta é feita na API, não no navegador. O transporte anual é `km por semana × 52 × fator` (carro 0,21, moto 0,11, transporte público 0,05, bicicleta ou caminhada 0). A energia é `kWh do mês × 12 × 0,085`. Os resíduos entram como 100 kg (sempre), 250 kg (às vezes) ou 450 kg (nunca).

Abaixo de 1500 kg o impacto é Baixo. De 1500 a 3500, Moderado. Acima de 3500, Alto.

Um exemplo para conferir: carro, 120 km por semana, 210 kWh e “Às vezes”. O total é 1774,60 kg de CO₂ no ano, impacto Moderado, com o detalhe de transporte, energia e resíduos e uma lista de recomendações.

> **[Inserir Print 13 — Resultado da calculadora com impacto moderado]**

Cada cálculo fica gravado. O visitante não vê a lista das outras pessoas. O administrador vê a quantidade, a média e a distribuição na visão geral.

### 2.5 Guias, vídeos e perguntas frequentes

Na página inicial, role até **Recursos** ou use o menu. Há três cartões.

**Acessar Materiais** abre guias e cartilhas. **Assistir Vídeos** abre os vídeos. Em ambos dá para filtrar pela categoria que já existe nos materiais (por exemplo Resíduos ou Energia). **Abrir material** ou **Assistir** leva ao endereço cadastrado, numa aba nova.

> **[Inserir Print 14 — Guias e cartilhas]**

O rodapé **Guias** volta para esta seção.

**Ver Perguntas** abre só as dúvidas já publicadas. O campo “Buscar nas perguntas” aceita uma palavra da pergunta ou da resposta, por exemplo energia, óleo ou pilhas. Clique em **Buscar**.

> **[Inserir Print 15 — FAQ com uma busca]**

Se nenhuma publicada combinar, aparece: “Nenhuma pergunta publicada combina com essa busca.”

### 2.6 Enviar uma dúvida

1. Com o FAQ aberto, clique em **Envie sua dúvida**.
2. O nome é opcional.
3. A pergunta precisa ter entre 10 e 1000 caracteres.
4. Clique em **Enviar**.

> **[Inserir Print 16 — Formulário Envie sua dúvida]**

A mensagem de sucesso é: “Dúvida enviada com sucesso! Ela será analisada por nossos educadores.” A pergunta fica com status pendente. Ela não entra na lista pública até o administrador responder e publicar.

> **[Inserir Print 17 — Confirmação do envio da dúvida]**

---

## 3. Manual do administrador

### 3.1 Entrar e sair

1. Clique em **Área Admin** ou abra http://localhost:5173/admin.
2. Se ainda não houver sessão, o site vai para `/admin/login`.
3. O e-mail já vem preenchido com `admin@climasustentavel.org`. Digite a senha `Admin@123`.
4. Envie o formulário.

> **[Inserir Print 18 — Tela de login do administrador]**

O painel cumprimenta “Olá, Administrador Clima Sustentável”. Há quatro abas: Visão geral e voluntários, Pontos de coleta, Recursos e Moderar FAQ.

**Sair** revoga o token e volta para o login. Quem abre `/admin` sem token também cai no login.

> **[Inserir Print 19 — Painel com as quatro abas]**

### 3.2 Visão geral e voluntários

A primeira aba mostra:

- quantas simulações a calculadora já gravou;
- a média de emissão anual;
- quantas simulações estão em Baixo, Moderado e Alto;
- a tabela de voluntários, com nome, e-mail, perfil, bairro, cidade e área de interesse.

> **[Inserir Print 20 — Métricas e lista de voluntários]**

Para remover uma inscrição, use a ação de excluir na linha. O sistema pede confirmação. **Cancelar** não apaga nada. Confirmar chama a API e o aviso traz “Voluntário removido com sucesso.”

> **[Inserir Print 21 — Confirmação antes de excluir um voluntário]**

Se não houver ninguém inscrito, a tabela diz: “Nenhum voluntário inscrito ainda.”

### 3.3 Pontos de coleta

Abra a aba **Pontos de coleta**. A lista é a dos pontos aprovados.

**Novo ponto** abre o formulário:

- categoria de resíduo;
- nome do local;
- endereço;
- bairro;
- cidade;
- horário.

Salvar grava o ponto já aprovado, então ele aparece na página pública. A mensagem é “Ponto de coleta cadastrado com sucesso.”

> **[Inserir Print 22 — Formulário de novo ecoponto]**

Na edição dá para alterar os mesmos campos e desmarcar **Aprovado e visível no site**. Desmarcado, o ponto some da consulta pública e também desta lista, que só mostra aprovados.

Excluir pede a mesma confirmação dos voluntários. A mensagem de sucesso é “Ponto de coleta removido com sucesso.”

### 3.4 Recursos educativos

Na aba **Recursos**, cadastre um guia ou um vídeo:

- título;
- tipo: guia ou vídeo;
- categoria (texto livre, por exemplo Energia ou Resíduos);
- descrição;
- URL do conteúdo.

O autor gravado é o administrador que está logado. O material passa a aparecer no cartão correspondente da página inicial.

> **[Inserir Print 23 — Cadastro de guia ou vídeo]**

Editar altera esses campos. Excluir pede confirmação e responde “Recurso educativo removido com sucesso.” Se a lista estiver vazia: “Nenhum recurso cadastrado.”

### 3.5 Moderar o FAQ

Na aba **Moderar FAQ** aparecem perguntas pendentes e publicadas. Dá para filtrar por todas, pendentes ou publicadas.

Abra uma pergunta pendente, escreva a resposta e mude o status para publicada. Salvar grava também quem respondeu. A mensagem é “Pergunta atualizada com sucesso.” A partir daí o visitante encontra a pergunta em **Ver Perguntas**.

> **[Inserir Print 24 — Resposta e publicação de uma dúvida]**

Se quiser guardar o texto sem mostrar no site, deixe o status em pendente. Excluir remove a pergunta de vez, depois da confirmação.

Lista vazia no filtro escolhido: “Nenhuma dúvida nesse filtro.”

---

## 4. Problemas comuns

| O que aconteceu | Onde | O que fazer |
| --- | --- | --- |
| “Este e-mail já está cadastrado.” | Inscrição | Use outro e-mail. O sistema não deixa duas inscrições com o mesmo endereço. |
| “Informe um e-mail válido.” | Inscrição ou login | O texto precisa ter o formato de e-mail, com `@` e domínio. |
| “O nome deve ter no mínimo 3 caracteres.” | Inscrição | Complete o nome. |
| “O bairro é obrigatório.”, “A cidade é obrigatória.” ou “A área de interesse é obrigatória.” | Inscrição | Preencha o campo indicado. O telefone pode ficar vazio. |
| “A pergunta deve ter no mínimo 10 caracteres.” | Envie sua dúvida | Escreva a dúvida com pelo menos 10 caracteres. O máximo é 1000. |
| “Nenhum ecoponto encontrado para esse filtro…” | Pontos de coleta | Troque o tipo de resíduo ou apague a busca. Confira se o ponto está aprovado no painel. |
| “Nenhuma pergunta publicada combina com essa busca.” | FAQ | A palavra não está numa pergunta publicada. Uma dúvida recém-enviada continua pendente até o administrador publicar. |
| “Nenhum material encontrado para esse filtro.” | Guias ou vídeos | Escolha Todas no filtro de categoria, ou cadastre um material desse tipo no painel. |
| “Credenciais inválidas.” | Login | A senha não confere com o e-mail. A padrão local é `Admin@123`. |
| “O e-mail é obrigatório.” ou “A senha é obrigatória.” | Login | Os dois campos precisam ir preenchidos. |
| “Não autenticado. Faça login para continuar.” | Painel | A sessão caiu. Entre de novo em `/admin/login`. |
| “Não foi possível conectar à API. Verifique se o back-end está em execução.” | Qualquer tela | O `php artisan serve` não está rodando, ou o front aponta para outra URL. Suba a API na porta 8000 ou ajuste `VITE_API_URL`. |
| Página em branco ou erro de CORS no navegador | Site | Abra o front em http://localhost:5173 ou http://127.0.0.1:5173. Outra origem é bloqueada. |
| `SQLSTATE[HY000] [2002] Connection refused` | `php artisan migrate` | O MySQL não está ligado, ou host, porta, usuário e senha do `.env` não batem com o servidor. |
| Banco desconhecido | `php artisan migrate` | Crie `clima_sustentavel` com o `CREATE DATABASE` da seção 1. O nome tem de ser o de `DB_DATABASE`. |
| Porta 8000 em uso | `php artisan serve` | Já existe uma API rodando. Use esse processo ou encerre o anterior antes de subir outro. |
| Porta 5173 em uso | `npm run dev` | O Vite deste projeto usa a porta 5173 fixa. Encerre o outro `npm run dev`. |
| `php artisan migrate --seed` acusa e-mail duplicado | Terminal | O conteúdo inicial já está no banco. Siga só com `php artisan serve`. Em um banco novo, use `php artisan migrate:fresh --seed`. |
| Entrei no painel e a lista de pontos está vazia | Admin | A aba só lista pontos aprovados. Um ponto desmarcado na edição não aparece ali nem no site. |
| Calculei a pegada e o número não fecha com a conta de cabeça | Calculadora | Confira as unidades: km são semanais (a API multiplica por 52) e kWh é mensal (a API multiplica por 12). O exemplo 120 km de carro, 210 kWh e reciclagem às vezes resulta em 1774,60 kg, impacto moderado. |
