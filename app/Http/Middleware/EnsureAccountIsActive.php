<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureAccountIsActive Middleware
 *
 * Protects authenticated routes from pending/rejected accounts.
 * Applied globally to all auth-protected routes.
 *
 * Handles edge case where business account status changes
 * after session is established — forces logout if account
 * is no longer active while session exists.
 *
 * Status checks:
 *   pending  → logout, redirect to login with message
 *   rejected → logout, redirect to login with message
 *   active   → allow through
 */
class EnsureAccountIsActive
{
    /**
     * Handle incoming request.
     * Check authenticated user account status on every request.
     * Forces logout if account no longer active.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only check authenticated users
        if (Auth::check()) {
            $user = Auth::user();

            // Force logout pending accounts
            // Handles case where business user somehow obtains session
            if ($user->isPending()) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')->withErrors([
                    'email' => 'Your business application is awaiting admin approval.',
                ]);
            }

            // Force logout rejected accounts
            if ($user->status === 'rejected') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')->withErrors([
                    'email' => 'Your application has been rejected. Contact support.',
                ]);
            }
        }

        return $next($request);
    }
}