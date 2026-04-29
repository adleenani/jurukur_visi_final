<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration to create the projects table with necessary fields for project management.
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('projects', function (Blueprint $table) {
        $table->id();                                               // Primary key for the projects table.
        $table->string('project_id', 20)->unique();                 // Unique identifier for each project (e.g., "PRJ001").
        $table->string('project_name', 100);                        // Name of the project (e.g., "Construction of Building A").
        $table->date('project_start');                              // Start date of the project.
        $table->date('project_end');                                // End date of the project.
        $table->string('project_location', 100);                    // Location of the project.
        $table->string('project_duration', 50);                     // Duration of the project.
        $table->string('project_services', 100);                    // Services associated with the project.
        $table->string('project_description')->nullable();          // Description of the project.
        $table->foreignId('created_by')->constrained('users');      // Reference to the user who created the project.
        $table->timestamps();                                       // Timestamps for created_at and updated_at.
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
