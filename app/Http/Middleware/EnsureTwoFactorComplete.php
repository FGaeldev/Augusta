<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureTwoFactorComplete Middleware
 *
 * Prevents access to protected routes until both authentication
 * steps are complete.
 *
 * Step 1 (password) sets pending_user_id in session.
 * Step 2 (security question) clears pending_user_id and calls Auth::login().
 *
 * This middleware ensures users with only pending_user_id in session
 * (completed Step 1 only) cannot access protected routes directly.
 *
 * Applied to all auth-protected routes except security question route.
 *
 * Guards against:
 *   - Direct URL access after Step 1
 *   - Session manipulation attempts
 */
class EnsureTwoFactorComplete
{
    /**
     * Handle incoming request.
     *
     * If pending_user_id exists but Auth::check() is false,
     * user completed Step 1 only — redirect to security question.
     *
     * If Auth::check() is true, both steps complete — allow through.
     *
     * If neither, redirect to login.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Both steps complete — fully authenticated
        if (Auth::check()) {
            return $next($request);
        }

        // Step 1 complete only — redirect to Step 2
        if (session('pending_user_id')) {
            return redirect()->route('security.question');
        }

        // No session at all — redirect to login
        return redirect()->route('login');
    }
}