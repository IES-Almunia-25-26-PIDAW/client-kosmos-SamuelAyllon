<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patient_profiles')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('workspace_id')->nullable()->constrained('workspaces')->nullOnDelete();
            $table->string('name');
            $table->string('local_path')->nullable();
            $table->enum('storage_type', ['local', 'gdrive'])->default('local');
            $table->string('gdrive_file_id')->nullable();
            $table->string('gdrive_url')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedInteger('size_bytes')->nullable();
            $table->enum('category', ['rgpd_consent', 'informed_consent', 'report', 'invoice', 'other'])->default('other');
            $table->boolean('is_rgpd')->default(false);
            $table->date('expires_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['patient_id', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
