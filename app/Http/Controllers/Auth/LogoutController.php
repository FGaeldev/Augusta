<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SessionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * LogoutController
 *
 * Handles user logout and session cleanup.
 *
 * On logout:
 *   - Records session end time in session_logs
 *   - Logs out user via Auth::logout()
 *   - Invalidates current session
 *   - Regenerates CSRF token
 *   - Redirects to login page
 *
 * Session end time recorded before Auth::logout() to ensure
 * session ID is still available for matching the correct log record.
 */
class LogoutController extends Controller
{
    /**
     * Handle logout request.
     *
     * Records logout time against current session ID in session_logs.
     * Destroys session and redirects to login.
     */
    public function destroy(Request $request)
    {
        // Record session end — must happen before session invalidation
        // Matches on both user_id and session_id to close only current session
        SessionLog::where('user_id', Auth::id())
            ->where('session_id', session()->getId())
            ->whereNull('logout_time')
            ->update(['logout_time' => now()]);

        // Logout user, invalidate session, regenerate CSRF token
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}