<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Application Model
 *
 * Tracks business account approval requests.
 * Created automatically on registration when role=business.
 *
 * Status flow:
 *   pending  → initial state on registration
 *   approved → admin approves → user status set to active
 *   rejected → admin rejects → user status set to rejected
 *
 * reviewed_by and reviewed_at populated when admin acts on application.
 * notes field allows admin to record reason for rejection.
 */
class Application extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'reviewed_by',
        'reviewed_at',
        'notes',
    ];

    /**
     * Cast reviewed_at as Carbon datetime for easy formatting.
     */
    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    /**
     * User who submitted this application.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Admin user who reviewed this application.
     * Nullable — null if not yet reviewed.
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}