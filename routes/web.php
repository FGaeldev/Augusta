<?php

use App\Http\Controllers\Admin\ApplicationController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SecurityQuestionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

/**
 * Web Routes
 *
 * Route groups:
 *   Public         — landing, login, register (guests only)
 *   Two-Factor     — security question (pending_user_id session required)
 *   Authenticated  — profile (all active roles)
 *   Admin          — dashboard, applications (admin role only)
 *
 * Middleware stack:
 *   auth.2fa — EnsureTwoFactorComplete — requires full auth
 *   admin    — EnsureUserIsAdmin — requires role=admin
 *
 * EnsureAccountIsActive runs globally on all web requests.
 */

/*
|--------------------------------------------------------------------------
| Public Routes — guests only
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return inertia('Home');
})->name('home');

// Login routes — redirect authenticated users away
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])
        ->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    Route::get('/register', [RegisterController::class, 'create'])
        ->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Two-Factor Routes — pending_user_id session required
|--------------------------------------------------------------------------
*/

// Accessible after Step 1 (password) only — before full auth
Route::get('/security-question', [SecurityQuestionController::class, 'create'])
    ->name('security.question');
Route::post('/security-question', [SecurityQuestionController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes — full auth required (both steps complete)
|--------------------------------------------------------------------------
*/

Route::middleware('auth.2fa')->group(function () {
    // Profile — all roles
    Route::get('/profile', [ProfileController::class, 'index'])
        ->name('profile');
    Route::post('/profile/security', [ProfileController::class, 'updateSecurity'])
        ->name('profile.security');
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])
        ->name('profile.password');

    // Logout
    Route::post('/logout', [LogoutController::class, 'destroy'])
        ->name('logout');
});

/*
|--------------------------------------------------------------------------
| Admin Routes — role=admin required
|--------------------------------------------------------------------------
*/

Route::middleware(['auth.2fa', 'admin'])->prefix('admin')->group(function () {
    // Main dashboard — accounts + logs
    Route::get('/', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    // Business applications
    Route::get('/applications', [ApplicationController::class, 'index'])
        ->name('admin.applications');
    Route::post('/applications/{application}/approve', [ApplicationController::class, 'approve'])
        ->name('admin.applications.approve');
    Route::post('/applications/{application}/reject', [ApplicationController::class, 'reject'])
        ->name('admin.applications.reject');
});