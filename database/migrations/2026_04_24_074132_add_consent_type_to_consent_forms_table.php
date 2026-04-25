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
        Schema::table('consent_forms', function (Blueprint $table) {
            $table->string('consent_type')->default('general')->after('patient_id');
            $table->index(['patient_id', 'consent_type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('consent_forms', function (Blueprint $table) {
            $table->dropIndex(['patient_id', 'consent_type', 'status']);
            $table->dropColumn('consent_type');
        });
    }
};
