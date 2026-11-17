<?php

use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->throttleApi();
        $middleware->prependToGroup('api', ForceJsonResponse::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $erroJson = function (string $message, int $status, array $extra = []) {
            return response()->json(array_merge([
                'success' => false,
                'message' => $message,
            ], $extra), $status);
        };

        $exceptions->render(function (ValidationException $e, Request $request) use ($erroJson) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $erroJson('Erro de validação nos dados enviados.', 422, [
                'errors' => $e->errors(),
            ]);
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) use ($erroJson) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $erroJson('Não autenticado. Faça login para continuar.', 401);
        });

        $exceptions->render(function (ModelNotFoundException $e, Request $request) use ($erroJson) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $erroJson('Recurso não encontrado.', 404);
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) use ($erroJson) {
            if (! $request->is('api/*')) {
                return null;
            }

            return $erroJson('Recurso não encontrado.', 404);
        });

        $exceptions->render(function (Throwable $e, Request $request) use ($erroJson) {
            if (! $request->is('api/*') || $e instanceof HttpExceptionInterface) {
                return null;
            }

            $mensagem = app()->isProduction()
                ? 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.'
                : ($e->getMessage() !== ''
                    ? $e->getMessage()
                    : 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.');

            return $erroJson($mensagem, 500);
        });
    })->create();
