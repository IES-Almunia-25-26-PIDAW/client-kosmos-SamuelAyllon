<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collaboration_agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professional_a_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('professional_b_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('workspace_id')->nullable()->constrained('workspaces')->nullOnDelete();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->enum('status', ['pending', 'active', 'ended', 'cancelled'])->default('pending');
            $table->json('terms')->nullable();
            $table->timestamps();

            $table->unique(['professional_a_id', 'professional_b_id', 'workspace_id'], 'collab_parties_workspace_unique');
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collaboration_agreements');
    }
};
