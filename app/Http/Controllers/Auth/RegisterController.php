<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

/**
 * RegisterController
 *
 * Handles new user registration for public and business roles.
 * Admin accounts are created via seeder only — role=admin
 * is explicitly blocked from registration.
 *
 * Registration flow:
 *   public   → account created, status=active, redirect to login
 *   business → account created, status=pending, application record
 *              created, redirect to login with pending notice
 *
 * Password and security answer stored as bcrypt hashes.
 * Plain text never persisted.
 */
class RegisterController extends Controller
{
    /**
     * Display registration form.
     */
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle registration form submission.
     *
     * Validates input, creates user, creates application record
     * for business accounts, redirects with appropriate message.
     */
    public function store(Request $request)
    {
        // Validate all fields — role restricted to public/business only
        $validated = $request->validate([
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
            'role' => ['required', 'in:public,business'],
            'security_question' => ['required', 'string', 'max:255'],
            'security_answer' => ['required', 'string', 'max:255'],
            'security_hint' => ['nullable', 'string', 'max:255'],
        ]);

        // Determine account status based on role
        // Business accounts start pending until admin approves
        $status = $validated['role'] === 'business' ? 'pending' : 'active';

        // Create user — password and security answer hashed automatically
        // password cast as 'hashed' in User model handles password
        // security_answer hashed explicitly here
        $user = User::create([
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'],
            'status' => $status,
            'security_question' => $validated['security_question'],
            'security_answer' => Hash::make($validated['security_answer']),
            'security_hint' => $validated['security_hint'] ?? null,
        ]);

        // Create application record for business accounts
        // Allows admin to review, approve, or reject in dashboard
        if ($validated['role'] === 'business') {
            Application::create([
                'user_id' => $user->id,
                'status' => 'pending',
            ]);

            return redirect()->route('login')->with(
                'message',
                'Application submitted. Await admin approval before logging in.'
            );
        }

        return redirect()->route('login')->with(
            'message',
            'Account created. You may now log in.'
        );
    }
}