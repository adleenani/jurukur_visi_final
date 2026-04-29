<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration to fix the tfa_code column in the users table by changing its length to 255 characters to accommodate longer TFA codes.
return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modifying the tfa_code column in the users table to change its length to 255 characters, allowing for longer TFA codes if needed.
        Schema::table('users', function (Blueprint $table) {
            $table->string('tfa_code', 255)->nullable()->change();
        });
    }

    public function down(): void
    {
        // Reverting the tfa_code column in the users table back to its original length of 10 characters.
        Schema::table('users', function (Blueprint $table) {
            $table->string('tfa_code', 10)->nullable()->change();
        });
    }
};
