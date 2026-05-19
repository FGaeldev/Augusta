<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\LoginLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

/**
 * LoginController
 *
 * Handles Step 1 of the two-step authentication flow.
 * Verifies email and password only — does NOT fully authenticate.
 *
 * On success: stores pending_user_id in session, redirects to
 * security question page (Step 2).
 *
 * Security measures:
 *   - Generic error message prevents user enumeration
 *   - Failed attempts tracked per user in database
 *   - Account locked for 60 seconds after 3 consecutive failures
 *   - Business pending accounts blocked with specific message
 *   - All attempts (success/fail) logged with IP address
 */
class LoginController extends Controller
{
    /**
     * Display login form.
     * Passes flash message from registration redirect if present.
     */
    public function create()
    {
        return Inertia::render('Auth/Login', [
            'message' => session('message'),
        ]);
    }

    /**
     * Handle login form submission (Step 1 — password verification).
     *
     * Flow:
     *   1. Validate input
     *   2. Find user by email
     *   3. Check lockout status
     *   4. Verify password
     *   5. Check account status (pending/rejected)
     *   6. Set pending session, redirect to security question
     */
    public function store(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        // Log attempt with null user_id if email not found
        // Still records IP for security monitoring
        if (!$user) {
            LoginLog::create([
                'user_id'        => null,
                'email_attempted' => $request->email,
                'success'        => false,
                'ip_address'     => $request->ip(),
            ]);

            // Generic message — prevents revealing whether email exists
            return back()->withErrors([
                'email' => 'Incorrect email or password.',
            ]);
        }

        // Check if account is locked due to failed attempts
        if ($user->isLocked()) {
            $seconds = now()->diffInSeconds($user->lock_until);
            return back()->withErrors([
                'email' => "Account locked. Try again in {$seconds} seconds.",
            ]);
        }

        // Verify password against bcrypt hash
        if (!Hash::check($request->password, $user->password)) {
            $failed = $user->failed_attempts + 1;
            $lockUntil = null;

            // Lock account for 60 seconds after 3 consecutive failures
            // Counter resets to 0 after lockout period begins
            if ($failed >= 3) {
                $lockUntil = now()->addSeconds(60);
                $failed    = 0;
            }

            $user->update([
                'failed_attempts' => $failed,
                'lock_until'      => $lockUntil,
            ]);

            LoginLog::create([
                'user_id'         => $user->id,
                'email_attempted' => $request->email,
                'success'         => false,
                'ip_address'      => $request->ip(),
            ]);

            return back()->withErrors([
                'email' => 'Incorrect email or password.',
            ]);
        }

        // Block pending business accounts with specific message
        if ($user->isPending()) {
            return back()->withErrors([
                'email' => 'Your business application is awaiting admin approval.',
            ]);
        }

        // Block rejected accounts
        if ($user->status === 'rejected') {
            return back()->withErrors([
                'email' => 'Your application has been rejected. Contact support.',
            ]);
        }

        // Password verified — reset failed attempts
        // Do NOT fully authenticate yet — 2FA step required
        $user->update([
            'failed_attempts' => 0,
            'lock_until'      => null,
        ]);

        // Store pending user in session — grants access to Step 2 only
        session(['pending_user_id' => $user->id]);

        // Log as unsuccessful until 2FA completes
        LoginLog::create([
            'user_id'         => $user->id,
            'email_attempted' => $request->email,
            'success'         => false,
            'ip_address'      => $request->ip(),
        ]);

        return redirect()->route('security.question');
    }
}