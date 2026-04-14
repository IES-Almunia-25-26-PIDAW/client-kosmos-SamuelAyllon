<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('patients', 'patient_profiles');

        Schema::table('patient_profiles', function (Blueprint $table) {
            $table->dropIndex('patients_user_id_is_active_index');
            $table->dropIndex('patients_user_id_payment_status_index');
        });

        Schema::table('patient_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'project_name',
                'brand_tone',
                'service_scope',
                'next_deadline',
                'payment_status',
                'has_valid_consent',
                'has_open_agreement',
            ]);
        });

        Schema::table('patient_profiles', function (Blueprint $table) {
            $table->foreignId('clinic_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            $table->foreignId('professional_id')->nullable()->after('clinic_id')->constrained('users')->nullOnDelete();
            $table->text('clinical_notes')->nullable()->after('avatar_path');
            $table->text('diagnosis')->nullable()->after('clinical_notes');
            $table->text('treatment_plan')->nullable()->after('diagnosis');
            $table->string('referral_source')->nullable()->after('treatment_plan');
            $table->enum('status', ['active', 'discharged', 'suspended', 'transferred'])->default('active')->after('referral_source');
            $table->timestamp('first_session_at')->nullable()->after('status');
            $table->timestamp('last_session_at')->nullable()->after('first_session_at');

            $table->index(['user_id', 'status'], 'patient_profiles_user_id_status_index');
            $table->index(['clinic_id', 'professional_id'], 'patient_profiles_clinic_professional_index');
        });
    }

    public function down(): void
    {
        Schema::table('patient_profiles', function (Blueprint $table) {
            $table->dropForeign(['clinic_id']);
            $table->dropForeign(['professional_id']);
            $table->dropColumn([
                'clinic_id', 'professional_id', 'clinical_notes', 'diagnosis',
                'treatment_plan', 'referral_source', 'status',
                'first_session_at', 'last_session_at',
            ]);

            $table->string('project_name')->default('');
            $table->string('brand_tone')->nullable();
            $table->text('service_scope')->nullable();
            $table->date('next_deadline')->nullable();
            $table->enum('payment_status', ['paid', 'pending', 'overdue'])->default('paid');
            $table->boolean('has_valid_consent')->default(false);
            $table->boolean('has_open_agreement')->default(false);
        });

        Schema::rename('patient_profiles', 'patients');
    }
};
