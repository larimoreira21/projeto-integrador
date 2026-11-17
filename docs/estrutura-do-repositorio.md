# Estrutura do repositório e versionamento

O Clima Sustentável fica num repositório só. O site e a API são pastas irmãs. A documentação das três situações-problema do PITE II fica em `docs/`.

## Árvore

```text
clima-sustentavel/
├── .gitignore                          # ignora vendor, node_modules, .env e builds
├── README.md                           # apresentação, índice e quick start
├── docs/
│   ├── estrutura-do-repositorio.md     # este guia
│   ├── situacao-problema-1/
│   │   ├── documentacao-projeto.md     # escopo, UML (Mermaid), IHC e dicionário de dados
│   │   ├── documentacao-projeto.pdf    # mesma documentação, para leitura e envio
│   │   └── diagramas-uml/
│   │       ├── casos-de-uso.png
│   │       ├── classes.png
│   │       ├── sequencia-calculadora.png
│   │       ├── sequencia-faq.png
│   │       ├── atividades-ecopontos.png
│   │       ├── mapa-navegacao.png
│   │       └── der.png
│   ├── situacao-problema-2/
│   │   └── manual-de-uso.md            # instalação, uso público, painel e erros
│   └── situacao-problema-3/
│       ├── verificacao-e-validacao.md
│       ├── evidencias-testes-unitarios.md
│       ├── formulario-avaliacao-pares.md
│       ├── relatorio-consolidado.md
│       ├── relatorio-consolidado.pdf
│       └── changelog-correcoes.md
├── back-end/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/        # um controller por recurso
│   │   │   ├── Middleware/
│   │   │   └── Requests/               # validação e mensagens em português
│   │   ├── Models/
│   │   ├── Providers/
│   │   └── Services/
│   │       └── CalculadoraPegadaService.php
│   ├── bootstrap/app.php               # rotas /api, CORS e erros em JSON
│   ├── config/
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   │       └── DatabaseSeeder.php
│   ├── public/index.php
│   ├── routes/api.php
│   ├── tests/
│   │   ├── Feature/
│   │   └── Unit/
│   ├── .env.example
│   ├── composer.json
│   ├── phpunit.xml
│   └── README.md
└── front-end/
    ├── public/
    ├── src/
    │   ├── components/                 # Navbar, home, modal e peças do painel
    │   │   └── admin/
    │   ├── context/                    # login, avisos e modal de inscrição
    │   ├── hooks/
    │   ├── pages/                      # Home, ecopontos, calculadora, login e painel
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── README.md
```

`back-end/vendor/` e `front-end/node_modules/` existem na máquina de quem instalou as dependências. Não entram no Git. O mesmo vale para `back-end/.env` e para a pasta `front-end/dist/`.

## O que vai em cada pasta de documentação

| Pasta | Arquivo | Conteúdo |
| --- | --- | --- |
| `docs/situacao-problema-1/` | `documentacao-projeto.md` e `.pdf` | Revisão de escopo, requisitos, UML, IHC e dicionário de dados |
| `docs/situacao-problema-1/diagramas-uml/` | PNG de cada diagrama | Figuras para quem abrir a pasta sem renderizar Mermaid |
| `docs/situacao-problema-2/` | `manual-de-uso.md` | Como instalar, usar o site e operar o painel |
| `docs/situacao-problema-3/` | `verificacao-e-validacao.md` | Revisão de código, testes PHPUnit e protocolo dos cinco pares |
| `docs/situacao-problema-3/` | `evidencias-testes-unitarios.md` | Saída de `php artisan test` e o que cada suíte cobre |
| `docs/situacao-problema-3/` | `formulario-avaliacao-pares.md` | Ficha em branco para cada pessoa que testar |
| `docs/situacao-problema-3/` | `relatorio-consolidado.md` e `.pdf` | Cinco fichas e matriz de triagem, prontas para preencher |
| `docs/situacao-problema-3/` | `changelog-correcoes.md` | Correções já feitas e espaço para as que saírem dos pares |

O vídeo narrado de demonstração não fica no repositório. O link entra na seção correspondente do `README.md`.

## Commits

Cada commit descreve uma mudança só, em português, com um destes prefixos:

| Prefixo | Quando usar |
| --- | --- |
| `feat:` | Funcionalidade nova, visível para quem usa o site ou a API |
| `fix:` | Correção de um comportamento que estava errado |
| `docs:` | README, manual, diagramas ou comentário de documentação |
| `test:` | Teste novo ou ajuste de teste, sem mudar a regra de negócio |
| `refactor:` | Organização interna, com o mesmo comportamento |

Exemplos:

```text
feat: lista ecopontos com filtro por resíduo
fix: impede cadastro público de ponto de coleta
docs: acrescenta o manual de uso do PITE II
test: cobre o cálculo moderado da pegada
```

## Subir e atualizar no GitHub

Na primeira vez, dentro da pasta do projeto:

```bash
git init
git add .
git status
git commit -m "docs: publica a documentação das situações-problema"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/clima-sustentavel.git
git push -u origin main
```

`git status` antes do commit mostra se `.env` ou `vendor/` escaparam. Esses arquivos não devem aparecer na lista.

Para trazer o que outra pessoa enviou e publicar o seu trabalho em seguida:

```bash
git pull origin main
git add .
git commit -m "feat: descreva a mudança aqui"
git push
```

Se o `pull` acusar conflito, abra o arquivo marcado, deixe o trecho certo, grave e faça um novo commit. Não use `git push --force` na `main`.
