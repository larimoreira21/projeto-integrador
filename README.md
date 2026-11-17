# Clima Sustentável

![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![PHPUnit](https://img.shields.io/badge/PHPUnit-11-3C9D32)

Plataforma educativa e comunitária da **ODS 13 — Ação contra a mudança global do clima**. O site explica práticas de mitigação e também deixa a pessoa participar: inscrever-se para uma ação, achar um ecoponto, estimar a própria emissão de CO₂ e enviar uma dúvida.

Projeto Integrador Transdisciplinar em Engenharia de Software II (PITE II).

## Arquitetura

O repositório tem duas aplicações que conversam por HTTP.

| Parte | Pasta | Papel |
| --- | --- | --- |
| Site | `front-end/` | React, Vite, Tailwind e Axios. Páginas, formulários e o painel. |
| API | `back-end/` | Laravel 11 em MVC. Models, FormRequests, controllers e o serviço da calculadora. MySQL guarda os dados. Sanctum autentica o administrador. PHPUnit testa a API. |

O visitante não acessa o banco. O React chama `http://localhost:8000/api`. A resposta vem em JSON: `success`, `message` e `data`.

No servidor, a regra da pegada fica em `CalculadoraPegadaService`. O controller só valida, chama o serviço e devolve o JSON. Assim a conta não se espalha pela interface.

## Documentação

- [Estrutura do repositório e Git](docs/estrutura-do-repositorio.md)
- [Situação-problema 1 — análise, UML, IHC e banco](docs/situacao-problema-1/documentacao-projeto.md) · [PDF](docs/situacao-problema-1/documentacao-projeto.pdf)
- [Situação-problema 2 — manual de uso](docs/situacao-problema-2/manual-de-uso.md)
- [Situação-problema 3 — verificação e validação](docs/situacao-problema-3/verificacao-e-validacao.md)
- [Situação-problema 3 — testes automatizados](docs/situacao-problema-3/evidencias-testes-unitarios.md)
- [Situação-problema 3 — ficha dos pares](docs/situacao-problema-3/formulario-avaliacao-pares.md)
- [Situação-problema 3 — relatório consolidado](docs/situacao-problema-3/relatorio-consolidado.md)
- [Situação-problema 3 — correções](docs/situacao-problema-3/changelog-correcoes.md)

## Vídeo demonstrativo

**[Link para o vídeo narrado de 5 minutos demonstrando o sistema e as melhorias pós-testes]**

Quando o vídeo estiver publicado, troque a linha acima pelo endereço (YouTube, Drive ou outro link que o avaliador consiga abrir). O roteiro sugerido: página inicial e ODS 13, inscrição, ecopontos, calculadora, envio de dúvida, login no painel e uma correção feita depois dos testes.

## Quick start

Pré-requisitos: PHP 8.2+, Composer 2, MySQL 8 e Node.js 18+.

Banco:

```sql
CREATE DATABASE clima_sustentavel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

API, na pasta `back-end/`:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Site, na pasta `front-end/`:

```bash
npm install
npm run dev
```

- Site: http://localhost:5173
- API: http://localhost:8000
- Painel: http://localhost:5173/admin
- Administrador local: `admin@climasustentavel.org` / `Admin@123`

O `migrate --seed` cria as tabelas e os dados iniciais, inclusive o administrador. O passo a passo completo está no [manual de uso](docs/situacao-problema-2/manual-de-uso.md).

Testes da API:

```bash
cd back-end
php artisan test
```
