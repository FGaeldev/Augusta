<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureUserIsAdmin Middleware
 *
 * Protects admin-only routes.
 * Rejects any authenticated user without role=admin.
 *
 * Applied to all routes under /admin prefix.
 * Frontend route protection is UI-only — this middleware
 * is the authoritative server-side enforcement layer.
 *
 * Unauthenticated users redirected to login.
 * Authenticated non-admin users redirected to home.
 */
class EnsureUserIsAdmin
{
    /**
     * Handle incoming request.
     * Allow only authenticated users with role=admin.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Redirect unauthenticated users to login
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Redirect authenticated non-admin users to home
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('home');
        }

        return $next($request);
    }
}