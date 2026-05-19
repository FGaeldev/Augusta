<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * LoginLog Model
 *
 * Audit trail for all login attempts — successful and failed.
 * Created on every login attempt regardless of outcome.
 *
 * user_id is nullable — null when submitted email does not match
 * any existing account. Email is still recorded for security monitoring.
 *
 * Used in admin dashboard login logs table.
 * Helps identify brute-force patterns and unauthorized access attempts.
 */
class LoginLog extends Model
{
    protected $fillable = [
        'user_id',
        'email_attempted',
        'success',
        'ip_address',
    ];

    /**
     * Cast success as boolean for clean conditionals.
     */
    protected function casts(): array
    {
        return [
            'success' => 'boolean',
        ];
    }

    /**
     * User associated with this login attempt.
     * Null if email_attempted did not match any account.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}