# Evidências dos testes automatizados

Comando, executado dentro de `back-end/`:

```bash
php artisan test
```

A suíte usa SQLite em memória (`phpunit.xml`). O MySQL não precisa estar ligado.

Resultado da última execução neste ambiente:

```text
PASS  Tests\Unit\CalculadoraPegadaServiceTest
  ✓ cenario de baixo impacto com bicicleta baixo kwh e reciclagem constante
  ✓ cenario de impacto moderado no exemplo da calculadora
  ✓ cenario de alto impacto com carro alta km alto kwh e sem reciclagem

PASS  Tests\Feature\AuthTest
  ✓ login valido retorna token e credencial invalida retorna 401
  ✓ logout revoga o token atual

PASS  Tests\Feature\CalculadoraPegadaTest
  ✓ calculo publico persiste e devolve o detalhamento
  ✓ estatisticas exigem admin e agregam as simulacoes

PASS  Tests\Feature\FaqTest
  ✓ duvida nasce pendente e so aparece depois que o admin publica

PASS  Tests\Feature\PontoColetaTest
  ✓ listagem publica filtra por categoria bairro e oculta nao aprovados
  ✓ admin cadastra ponto e exclui com 200

PASS  Tests\Feature\RecursoEducativoTest
  ✓ listagem publica filtra tipo e cadastro exige admin

PASS  Tests\Feature\VoluntarioTest
  ✓ cadastro valido retorna 201 e email duplicado retorna 422
  ✓ listagem bloqueia anonimo e permite admin com token
  ✓ admin remove voluntario e id inexistente retorna 404

Tests:    14 passed (133 assertions)
Duration: 0.46s
```

| Arquivo | O que confirma |
| --- | --- |
| `tests/Unit/CalculadoraPegadaServiceTest.php` | Impacto baixo, o exemplo moderado de 1774,60 kg e o cenário alto |
| `tests/Feature/AuthTest.php` | Login com token, senha errada em 401 e logout que revoga o token |
| `tests/Feature/CalculadoraPegadaTest.php` | Cálculo público gravado e estatísticas só com administrador |
| `tests/Feature/FaqTest.php` | Dúvida nasce pendente e só aparece no site depois de publicada |
| `tests/Feature/PontoColetaTest.php` | Filtro público, ocultação de ponto não aprovado, cadastro e exclusão só com admin |
| `tests/Feature/RecursoEducativoTest.php` | Filtro de guias e vídeos e cadastro protegido |
| `tests/Feature/VoluntarioTest.php` | Cadastro 201, e-mail duplicado 422, listagem e exclusão só com admin |

O relatório dos testes feitos por outras pessoas fica em `relatorio-testes-pares.pdf`, nesta mesma pasta.
