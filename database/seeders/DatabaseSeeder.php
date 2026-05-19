<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

/**
 * DatabaseSeeder
 *
 * Seeds the initial admin account.
 * Admin accounts are ONLY created via this seeder —
 * registration form does not allow admin role selection.
 *
 * Run with: php artisan db:seed
 * Reset + reseed: php artisan migrate:fresh --seed
 *
 * Change credentials below before running in production.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create default admin account
        // IMPORTANT: Change email and password before deploying
        User::create([
            'email'             => 'admin@goldensky.com',
            'password'          => Hash::make('Admin@12345'),
            'role'              => 'admin',
            'status'            => 'active',
            'security_question' => 'What is the name of the first travel destination you managed?',
            'security_answer'   => Hash::make('goldensky'),
            'security_hint'     => 'The company name',
            'failed_attempts'   => 0,
            'lock_until'        => null,
        ]);
    }
}