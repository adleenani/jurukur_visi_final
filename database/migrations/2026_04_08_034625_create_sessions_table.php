<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    // Migration to create the sessions table for storing user session data, including user ID, IP address, user agent, payload, and last activity timestamp.
    public function up(): void
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();                        // Primary key for the sessions table, using a string to store the session ID.
            $table->foreignId('user_id')->nullable()->index();      // Foreign key referencing the users table, allowing null values for guest sessions and indexed for faster lookups.
            $table->string('ip_address', 45)->nullable();           // IP address of the user associated with the session, allowing null values and supporting both IPv4 and IPv6 formats.
            $table->text('user_agent')->nullable();                 // User agent string of the user associated with the session, allowing null values.
            $table->longText('payload');                            // Long text field to store the session payload.
            $table->integer('last_activity')->index();              // Integer field to store the timestamp of the last activity, indexed for faster lookups.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
