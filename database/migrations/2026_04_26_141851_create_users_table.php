<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['admin', 'business', 'public'])->default('public');
            $table->enum('status', ['active', 'pending', 'rejected'])->default('active');
            $table->string('security_question');
            $table->string('security_answer');
            $table->string('security_hint')->nullable();
            $table->integer('failed_attempts')->default(0);
            $table->timestamp('lock_until')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};