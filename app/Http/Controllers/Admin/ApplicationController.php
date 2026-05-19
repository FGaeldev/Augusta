<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * ApplicationController
 *
 * Handles business account application review for admins.
 * All methods protected by admin middleware — defined in routes.
 *
 * Application flow:
 *   pending  → admin reviews → approved or rejected
 *   approved → user status set to active → account accessible
 *   rejected → user status set to rejected → account blocked
 *
 * reviewed_by and reviewed_at recorded on every decision.
 * notes field allows admin to record reason for rejection.
 */
class ApplicationController extends Controller
{
    /**
     * Display all applications with associated user data.
     * Ordered by status (pending first) then by date.
     */
    public function index()
    {
        $applications = Application::with('user:id,email,role,status,created_at')
            ->latest()
            ->get();

        return Inertia::render('Admin/Applications', [
            'applications' => $applications,
        ]);
    }

    /**
     * Approve a business application.
     * Sets application status to approved.
     * Sets associated user status to active — unlocks login access.
     * Records reviewing admin and timestamp.
     */
    public function approve(Request $request, Application $application)
    {
        // Update application record
        $application->update([
            'status' => 'approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'notes' => $request->notes ?? null,
        ]);

        // Unlock user account — status active grants login access
        $application->user->update([
            'status' => 'active',
        ]);

        return back()->with('message', 'Application approved.');
    }

    /**
     * Reject a business application.
     * Sets application status to rejected.
     * Sets associated user status to rejected — permanently blocks login.
     * Notes field required on rejection to record reason.
     * Records reviewing admin and timestamp.
     */
    public function reject(Request $request, Application $application)
    {
        $request->validate([
            'notes' => ['required', 'string', 'max:500'],
        ]);

        // Update application record
        $application->update([
            'status' => 'rejected',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'notes' => $request->notes,
        ]);

        // Block user account permanently
        $application->user->update([
            'status' => 'rejected',
        ]);

        return back()->with('message', 'Application rejected.');
    }
}