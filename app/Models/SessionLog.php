<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * SessionLog Model
 *
 * Tracks authenticated user sessions from login to logout.
 * Created after successful 2FA completion (full authentication).
 * logout_time populated on explicit logout or session expiry.
 *
 * session_id stores PHP/Laravel session ID regenerated on login
 * to prevent session fixation attacks.
 *
 * Used in admin dashboard session logs table.
 * Enforces one-active-session-per-user policy by checking
 * for existing records with null logout_time.
 */
class SessionLog extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'login_time',
        'logout_time',
    ];

    /**
     * Cast timestamps as Carbon datetime for easy formatting and comparison.
     */
    protected function casts(): array
    {
        return [
            'login_time' => 'datetime',
            'logout_time' => 'datetime',
        ];
    }

    /**
     * User who owns this session.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Returns true if session is still active (no logout recorded).
     */
    public function isActive(): bool
    {
        return $this->logout_time === null;
    }
}