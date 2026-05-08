<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('patient_profiles', function (Blueprint $table) {
            $table->text('consultation_reason')->nullable()->after('referral_source');
            $table->string('therapeutic_approach', 150)->nullable()->after('consultation_reason');
            $table->unique(['user_id', 'workspace_id'], 'patient_profiles_user_workspace_unique');
        });
    }

    public function down(): void
    {
        Schema::table('patient_profiles', function (Blueprint $table) {
            $table->dropUnique('patient_profiles_user_workspace_unique');
            $table->dropColumn(['consultation_reason', 'therapeutic_approach']);
        });
    }
};
