<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('professional_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('workspace_id')->nullable()->constrained('workspaces')->nullOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->enum('role', ['primary', 'secondary', 'substitute', 'co_therapist'])->default('primary');
            $table->enum('status', ['active', 'paused', 'ended'])->default('active');
            $table->date('started_at')->nullable();
            $table->date('ended_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['patient_id', 'professional_id', 'workspace_id']);
            $table->index(['professional_id', 'status']);
            $table->index(['patient_id', 'is_primary', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_assignments');
    }
};
