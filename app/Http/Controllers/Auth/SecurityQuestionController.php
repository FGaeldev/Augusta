<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\LoginLog;
use App\Models\SessionLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

/**
 * SecurityQuestionController
 *
 * Handles Step 2 of the two-step authentication flow.
 * Verifies the user's security question answer.
 *
 * Requires pending_user_id in session (set by LoginController).
 * Without it, redirects back to login — prevents direct URL access.
 *
 * On success:
 *   - Closes all prior active sessions (one-session-per-user policy)
 *   - Fully authenticates user via Auth::login()
 *   - Regenerates session ID (prevents session fixation)
 *   - Records session start in session_logs
 *   - Updates login_logs success flag
 *   - Redirects based on role
 *
 * Security answer compared against bcrypt hash stored at registration.
 */
class SecurityQuestionController extends Controller
{
    /**
     * Display security question form.
     * Loads question and hint for pending user.
     * Redirects to login if no pending session exists.
     */
    public function create()
    {
        // Guard — no pending session means direct URL access attempt
        if (!session('pending_user_id')) {
            return redirect()->route('login');
        }

        $user = User::find(session('pending_user_id'));

        if (!$user) {
            session()->forget('pending_user_id');
            return redirect()->route('login');
        }

        return Inertia::render('Auth/SecurityQuestion', [
            'question' => $user->security_question,
            'hint' => $user->security_hint,
        ]);
    }

    /**
     * Handle security question form submission (Step 2 — answer verification).
     *
     * Flow:
     *   1. Verify pending session exists
     *   2. Verify answer against stored hash
     *   3. Close existing active sessions
     *   4. Fully authenticate user
     *   5. Regenerate session ID
     *   6. Log session start
     *   7. Update login log to success
     *   8. Redirect by role
     */
    public function store(Request $request)
    {
        // Guard — reject if no pending session
        if (!session('pending_user_id')) {
            return redirect()->route('login');
        }

        $request->validate([
            'answer' => ['required', 'string'],
        ]);

        $user = User::find(session('pending_user_id'));

        if (!$user) {
            session()->forget('pending_user_id');
            return redirect()->route('login');
        }

        // Verify answer against bcrypt hash
        if (!Hash::check($request->answer, $user->security_answer)) {
            return back()->withErrors([
                'answer' => 'Incorrect security answer.',
            ]);
        }

        // Enforce one-active-session-per-user policy
        // Close all existing active sessions before creating new one
        SessionLog::where('user_id', $user->id)
            ->whereNull('logout_time')
            ->update(['logout_time' => now()]);

        // Clear pending session before full auth
        session()->forget('pending_user_id');

        // Fully authenticate user
        Auth::login($user);

        // Regenerate session ID — prevents session fixation attacks
        $request->session()->regenerate();

        // Record new session in session_logs
        SessionLog::create([
            'user_id' => $user->id,
            'session_id' => session()->getId(),
            'login_time' => now(),
        ]);

        // Update most recent login log to success
        LoginLog::where('user_id', $user->id)
            ->latest()
            ->first()
            ->update(['success' => true]);

        // Redirect based on role
        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'business' => redirect()->route('profile'),
            default => redirect()->route('profile'),
        };
    }
}