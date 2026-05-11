<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->index(
                ['professional_id', 'starts_at', 'ends_at'],
                'appointments_professional_time_range_idx'
            );
            $table->index(
                ['patient_id', 'starts_at', 'ends_at'],
                'appointments_patient_time_range_idx'
            );
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->index(
                ['status', 'due_at'],
                'invoices_status_due_at_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropIndex('appointments_professional_time_range_idx');
            $table->dropIndex('appointments_patient_time_range_idx');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropIndex('invoices_status_due_at_idx');
        });
    }
};
