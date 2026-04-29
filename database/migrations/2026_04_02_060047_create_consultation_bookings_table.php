<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    // Migration to create the consultation_bookings table with necessary fields for managing consultation bookings.
   public function up(): void
{
    Schema::create('consultation_bookings', function (Blueprint $table) {
        $table->id();
        $table->uuid('reference_number')->unique();                         // Unique reference number for each booking.
        $table->string('name', 100);                                        // Name of the person booking the consultation.
        $table->string('email', 100);                                       // Email address of the person booking the consultation.
        $table->string('phone', 20);                                        // Phone number of the person booking the consultation.
        $table->string('service_type', 100);                                // Type of service requested (e.g., "General Consultation", "Project Discussion").
        $table->date('preferred_date');                                     // Preferred date for the consultation.
        $table->string('preferred_time', 20);                               // Preferred time for the consultation (e.g., "10:00 AM").
        $table->string('consultation_type', 50);                            // Type of consultation (e.g., "online", "in-person").
        $table->text('message')->nullable();                                // Optional message from the user with additional details or questions.
        $table->string('status', 20)->default('pending');                   // Status of the booking (e.g., "pending", "confirmed", "rejected").
        $table->text('admin_response')->nullable();                         // Optional field for admin to provide feedback or reasons for rejection.
        $table->text('admin_notes')->nullable();                            // Optional field for admin to add internal notes about the booking.   
        $table->date('confirmed_date')->nullable();                         // Date of the confirmed consultation (if applicable).
         $table->string('confirmed_time', 20)->nullable();                  // Time of the confirmed consultation (if applicable).
        $table->string('confirmed_time', 20)->nullable();                   // Time of the confirmed consultation (if applicable).
        $table->foreignId('created_by')->nullable()->constrained('users');  // Reference to the user who created the booking (if applicable).
        $table->timestamps();                                               // Timestamps for created_at and updated_at.
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
