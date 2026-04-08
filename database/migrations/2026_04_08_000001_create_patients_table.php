<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('project_name');
            $table->string('brand_tone')->nullable();
            $table->text('service_scope')->nullable();
            $table->date('next_deadline')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('avatar_path')->nullable();
            $table->boolean('is_active')->default(true);
            $table->enum('payment_status', ['paid', 'pending', 'overdue'])->default('paid');
            $table->boolean('has_valid_consent')->default(false);
            $table->boolean('has_open_agreement')->default(false);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['user_id', 'is_active']);
            $table->index(['user_id', 'payment_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
