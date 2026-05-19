<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * User Model
 *
 * Represents a system user. Three roles exist:
 *   - admin:    Full site access. Created via seeder only.
 *   - business: Travel agency accounts. Require admin approval before access.
 *   - public:   General users. Instant access on registration.
 *
 * Business accounts begin with status=pending and are blocked
 * from login until an admin sets status=active via the applications table.
 *
 * Sensitive fields (password, security_answer) are hidden from
 * serialization and cast appropriately to prevent plaintext exposure.
 */
class User extends Authenticatable
{
    use Notifiable;

    /**
     * Mass-assignable fields.
     * Excludes role — assigned programmatically, never from raw request input.
     */
    protected $fillable = [
        'email',
        'password',
        'role',
        'status',
        'security_question',
        'security_answer',
        'security_hint',
        'failed_attempts',
        'lock_until',
    ];

    /**
     * Fields excluded from JSON/array serialization.
     * Prevents password hashes and security answers leaking in API responses.
     */
    protected $hidden = [
        'password',
        'security_answer',
        'remember_token',
    ];

    /**
     * Attribute casts.
     * password: auto-hashed on set via Laravel's hashed cast.
     * lock_until: Carbon datetime for easy comparison.
     * failed_attempts: integer for arithmetic operations.
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'lock_until' => 'datetime',
            'failed_attempts' => 'integer',
        ];
    }

    /**
     * Returns true if account is currently locked due to failed attempts.
     * Compares lock_until timestamp against current time.
     */
    public function isLocked(): bool
    {
        return $this->lock_until && $this->lock_until->isFuture();
    }

    /**
     * Returns true if business account is awaiting admin approval.
     * Pending accounts are blocked from login regardless of credentials.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Business application associated with this user.
     * Only exists for role=business accounts.
     */
    public function application()
    {
        return $this->hasOne(Application::class);
    }

    /**
     * All login attempts (success + failed) associated with this user.
     * Used in admin login logs dashboard.
     */
    public function loginLogs()
    {
        return $this->hasMany(LoginLog::class);
    }

    /**
     * All sessions associated with this user.
     * Tracks login/logout times for admin session logs dashboard.
     */
    public function sessionLogs()
    {
        return $this->hasMany(SessionLog::class);
    }
}