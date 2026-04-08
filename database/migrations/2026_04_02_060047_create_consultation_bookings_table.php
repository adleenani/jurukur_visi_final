<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('consultation_bookings', function (Blueprint $table) {
        $table->id();
        $table->uuid('reference_number')->unique();
        $table->string('name', 100);
        $table->string('email', 100);
        $table->string('phone', 20);
        $table->string('service_type', 100);
        $table->date('preferred_date');
        $table->string('preferred_time', 20);
        $table->string('consultation_type', 50);
        $table->text('message')->nullable();
        $table->string('status', 20)->default('pending');
        $table->text('admin_response')->nullable();
        $table->text('admin_notes')->nullable();
        $table->date('confirmed_date')->nullable();
        $table->string('confirmed_time', 20)->nullable();
        $table->foreignId('created_by')->nullable()->constrained('users');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultation_bookings');
    }
};
