<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

/**
 * HandleInertiaRequests Middleware
 *
 * Runs on every Inertia request.
 * Shares global data with all React page components via usePage().props.
 *
 * Shared data:
 *   auth.user — current authenticated user (safe fields only)
 *               null if not authenticated
 *
 * auth.user available in all pages and layouts via:
 *   const { auth } = usePage().props;
 *   const user = auth.user;
 *
 * Password and security_answer excluded by User model $hidden.
 * Only fields needed by frontend included to minimize data exposure.
 */
class HandleInertiaRequests extends Middleware
{
    /**
     * Root Inertia view — matches resources/views/welcome.blade.php.
     */
    protected $rootView = 'welcome';

    /**
     * Asset version for cache busting on deployment.
     * Laravel Vite plugin handles this automatically.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Shared data available to all Inertia pages.
     * Merged with page-specific props on every request.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                // Share safe user fields only — null if guest
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'status' => $request->user()->status,
                ] : null,
            ],

            // Flash messages — passed from controller redirects
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }
}