# Verificação e validação — Clima Sustentável

Este registro separa duas perguntas. A verificação confere se o sistema foi construído como o projeto descreve. A validação confere se ele serve para quem vai usar. O vídeo demonstrativo não faz parte deste registro.

## 1. Verificação

### 1.1 Revisão de código

A API está em MVC. Os models ficam em `back-end/app/Models`, a validação em `app/Http/Requests`, os controllers em `app/Http/Controllers/Api` e a regra da pegada em `app/Services/CalculadoraPegadaService.php`. A “visão” da API é o JSON. As telas estão no React, em `front-end/src`.

Conferência entre o React e as rotas de `routes/api.php`:

| Chamada no front | Rota na API | Acesso |
| --- | --- | --- |
| `POST /login` e `POST /logout` | iguais | logout exige token |
| `POST /voluntarios` | igual | público |
| `GET /voluntarios` e `DELETE /voluntarios/{id}` | iguais | admin |
| `GET /categorias-residuos` | igual | público |
| `GET /pontos-coleta` | igual | público |
| `POST`, `PUT` e `DELETE /pontos-coleta` | iguais | admin |
| `POST /calculadora-pegada` | igual | público |
| `GET /calculadora-pegada/estatisticas` | igual | admin |
| `GET`, `POST`, `PUT` e `DELETE /recursos` | iguais | escrita só com admin |
| `GET` e `POST /faqs` | iguais | público |
| `GET /admin/faqs`, `PUT` e `DELETE /admin/faqs/{id}` | iguais | admin |

Não há chamada do React para uma rota que não existe. O visitante não envia cadastro de ecoponto: essa tela foi retirada e a rota exige token.

O dicionário de dados e o DDL em `docs/situacao-problema-1/documentacao-projeto.md` usam os mesmos nomes e tipos das migrations (`users`, `voluntarios`, `categorias_residuos`, `pontos_coleta`, `simulacoes_pegada`, `recursos_educativos`, `perguntas_faq`). No diagrama de classes, os métodos do `User` foram alinhados ao código: `recursosEducativos()` e `faqsRespondidas()`. A multiplicidade do autor e do respondente ficou `0..1`, porque essas chaves aceitam nulo. `classificar` e `recomendacoes` aparecem como operações privadas do serviço.

### 1.2 Testes automatizados

A evidência está em `evidencias-testes-unitarios.md`. Na última execução: 14 testes, 133 asserções, todos passando. A suíte cobre cálculo baixo, moderado e alto, login e logout, calculadora e estatísticas, FAQ pendente até publicar, filtro de ecoponto e bloqueio do cadastro anônimo, recursos e voluntários (incluindo e-mail duplicado e exclusão).

## 2. Validação com usuários

A validação desta etapa é feita por cinco pessoas, cada uma com a ficha de `formulario-avaliacao-pares.md`. O conjunto das cinco fichas e a matriz de triagem ficam em `relatorio-consolidado.md`.

Enquanto as fichas não forem preenchidas, não há resultado de validação para declarar. Não se inventa nome, data nem defeito de par. A validação anterior, com 12 moradores, refere-se ao portal estático da atividade extensionista e está registrada na situação-problema 1 como origem do escopo, não como teste desta versão.

## 3. O que já foi corrigido antes dos pares

As correções da revisão interna estão em `changelog-correcoes.md`: textos do rodapé, estados de carregamento e de lista vazia, confirmação antes de excluir, e retirada do cadastro público de ecoponto. O repositório ainda não é um Git inicializado; o histórico de commits passa a valer depois do `git init` descrito em `docs/estrutura-do-repositorio.md`.
