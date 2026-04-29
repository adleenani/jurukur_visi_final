<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration to add a must_change_password column to the users table, allowing administrators to require users to change their password on next login.
return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Adding a boolean column named must_change_password to the users table, with a default value of false, and placing it after the is_active column for better organization.
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('must_change_password')->default(false)->after('is_active');
        });
    }

    public function down(): void
    {
        // Removing the must_change_password column from the users table if the migration is rolled back.
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('must_change_password');
        });
    }
};
