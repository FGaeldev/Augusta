<?php

use App\Http\Middleware\EnsureAccountIsActive;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureTwoFactorComplete;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

/**
 * Application Bootstrap
 *
 * Configures routing, middleware stack, and exception handling.
 *
 * Middleware aliases registered here allow route files to
 * reference middleware by short name rather than full class path.
 *
 * Global web middleware:
 *   HandleInertiaRequests — shares data with all Inertia responses
 *   EnsureAccountIsActive — checks account status on every request
 *
 * Route middleware aliases:
 *   auth.2fa   — requires full two-factor authentication complete
 *   admin      — requires role=admin
 */
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Append to web middleware group — runs on every web request
        $middleware->web(append: [
            HandleInertiaRequests::class,
            EnsureAccountIsActive::class,
        ]);

        // Register middleware aliases for use in route definitions
        $middleware->alias([
            'auth.2fa' => EnsureTwoFactorComplete::class,
            'admin'    => EnsureUserIsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();