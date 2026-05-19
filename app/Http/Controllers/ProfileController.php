<?php

namespace App\Http\Controllers;

use App\Models\SessionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

/**
 * ProfileController
 *
 * Handles profile viewing and editing for all authenticated roles.
 * Admin, business, and public users all share this controller.
 *
 * Features:
 *   - View profile (email, role, status, security question, hint)
 *   - Update security question, answer, and hint
 *   - Change password (requires current password verification)
 *
 * Sensitive data (password hash, security answer hash) never
 * returned to frontend — hidden by User model serialization.
 */
class ProfileController extends Controller
{
    /**
     * Display profile page.
     * Returns safe user fields only — model $hidden ensures
     * password and security_answer hashes are never exposed.
     */
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Profile/Index', [
            'user' => [
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'security_question' => $user->security_question,
                'security_hint' => $user->security_hint,
            ],
        ]);
    }

    /**
     * Update security question, answer, and hint.
     * Answer re-hashed with bcrypt before storage.
     * Both question and answer required — hint optional.
     */
    public function updateSecurity(Request $request)
    {
        $request->validate([
            'security_question' => ['required', 'string', 'max:255'],
            'security_answer' => ['required', 'string', 'max:255'],
            'security_hint' => ['nullable', 'string', 'max:255'],
        ]);

        Auth::user()->update([
            'security_question' => $request->security_question,
            'security_answer' => Hash::make($request->security_answer),
            'security_hint' => $request->security_hint,
        ]);

        return back()->with('message', 'Security question updated.');
    }

    /**
     * Change user password.
     *
     * Validation order:
     *   1. All fields required
     *   2. New password meets strength policy
     *   3. Current password verified against stored hash
     *
     * Current password verification prevents unauthorized changes
     * if session is compromised.
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
        ]);

        $user = Auth::user();

        // Verify current password before allowing change
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'Current password is incorrect.',
            ]);
        }

        // Update password — hashed automatically via model cast
        $user->update([
            'password' => $request->password,
        ]);

        return back()->with('message', 'Password updated successfully.');
    }
}