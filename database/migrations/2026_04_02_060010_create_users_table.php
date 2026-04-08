<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username', 50)->unique();
            $table->string('full_name', 100)->nullable();
            $table->string('email', 100)->unique();
            $table->string('password');
            $table->string('role', 20)->default('pic');
            $table->boolean('is_active')->default(false);
            $table->string('tfa_code', 10)->nullable();
            $table->timestamp('lockout_until')->nullable();
            $table->integer('failed_attempts')->default(0);
            $table->timestamps();
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
