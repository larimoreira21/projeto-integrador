# Front-end

Site do Clima Sustentável, feito com React e Vite. As páginas falam com a API em `http://localhost:8000/api`.

```bash
cd front-end
npm install
npm run dev
```

Abre em `http://localhost:5173`. A API precisa estar rodando antes (`php artisan serve` dentro de `back-end/`).

Se a API estiver em outro endereço, crie um arquivo `.env` nesta pasta:

```bash
VITE_API_URL=http://localhost:8000/api
```

O site tem a página inicial (práticas, materiais e dúvidas), a lista de ecopontos, a calculadora de pegada e o painel do administrador em `/admin`.
