# Back-end

API do Clima Sustentável, em Laravel 11.

```bash
cd back-end
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Sobe em `http://localhost:8000`. O passo a passo do banco, o login do admin e a lista de rotas estão no [README da raiz](../README.md).

Para rodar os testes:

```bash
php artisan test
```
