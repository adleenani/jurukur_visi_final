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
    Schema::create('projects', function (Blueprint $table) {
        $table->id();
        $table->string('project_id', 20)->unique();
        $table->string('project_name', 100);
        $table->date('project_start');
        $table->date('project_end');
        $table->string('project_location', 100);
        $table->string('project_duration', 50);
        $table->string('project_services', 100);
        $table->string('project_description')->nullable();
        $table->foreignId('created_by')->constrained('users');
        $table->timestamps();
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
