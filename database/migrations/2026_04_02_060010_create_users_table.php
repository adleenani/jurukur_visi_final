<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration to create the users table with necessary fields for authentication and user management.
return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();                                           // Primary key for the users table.
            $table->string('username', 50)->unique();               // Unique username for each user (e.g., "john_doe").
            $table->string('full_name', 100)->nullable();           // Full name of the user (e.g., "John Doe").
            $table->string('email', 100)->unique();                 // Unique email address for each user.
            $table->string('password');                             // Hashed password for the user.
            $table->string('role', 20)->default('pic');             // Role of the user (e.g., "admin", "pic").
            $table->boolean('is_active')->default(false);           // Status indicating if the user is active.
            $table->string('tfa_code', 10)->nullable();             // Two-factor authentication code.
            $table->timestamp('lockout_until')->nullable();         // Timestamp until which the user is locked out after failed login attempts.
            $table->integer('failed_attempts')->default(0);         // Counter for failed login attempts.
            $table->timestamps();                                   // Timestamps for created_at and updated_at.                           
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
