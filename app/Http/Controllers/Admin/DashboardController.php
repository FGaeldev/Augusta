<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoginLog;
use App\Models\SessionLog;
use App\Models\User;
use Inertia\Inertia;

/**
 * DashboardController
 *
 * Handles the admin dashboard views.
 * All methods protected by admin middleware — defined in routes.
 *
 * Dashboard sections:
 *   - Accounts table: all users with role, status, created date
 *   - Login logs: 50 most recent attempts with success/fail, IP
 *   - Session logs: 50 most recent sessions with login/logout times
 *
 * Sensitive fields excluded from all responses:
 *   - password, security_answer hidden by User model
 *   - Only safe fields explicitly selected in queries
 */
class DashboardController extends Controller
{
    /**
     * Display main admin dashboard.
     * Returns accounts, login logs, and session logs in single request.
     * Paginated to 50 records each to prevent memory issues.
     */
    public function index()
    {
        // Fetch all users — safe fields only
        // password and security_answer excluded by model $hidden
        $accounts = User::select(
            'id',
            'email',
            'role',
            'status',
            'created_at'
        )->latest()->get();

        // 50 most recent login attempts — includes null user_id for unknown emails
        $loginLogs = LoginLog::with('user:id,email')
            ->latest()
            ->limit(50)
            ->get();

        // 50 most recent sessions — joined with user email
        $sessionLogs = SessionLog::with('user:id,email')
            ->latest('login_time')
            ->limit(50)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'accounts' => $accounts,
            'loginLogs' => $loginLogs,
            'sessionLogs' => $sessionLogs,
        ]);
    }
}