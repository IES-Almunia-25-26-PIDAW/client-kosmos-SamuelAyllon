<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('session_recordings', function (Blueprint $table) {
            $table->timestamp('patient_consent_given_at')->nullable()->after('transcription_status');
        });
    }

    public function down(): void
    {
        Schema::table('session_recordings', function (Blueprint $table) {
            $table->dropColumn('patient_consent_given_at');
        });
    }
};
