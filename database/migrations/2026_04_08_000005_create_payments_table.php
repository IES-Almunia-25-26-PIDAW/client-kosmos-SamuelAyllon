<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('consulting_session_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('concept')->nullable();
            $table->enum('payment_method', ['cash', 'bizum', 'transfer', 'card'])->nullable();
            $table->enum('status', ['pending', 'paid', 'overdue', 'claimed'])->default('pending');
            $table->date('due_date');
            $table->dateTime('paid_at')->nullable();
            $table->string('invoice_number')->nullable()->unique();
            $table->dateTime('invoice_sent_at')->nullable();
            $table->unsignedTinyInteger('reminder_count')->default(0);
            $table->dateTime('last_reminder_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['user_id', 'status']);
            $table->index(['patient_id', 'status']);
            $table->index(['user_id', 'due_date', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
