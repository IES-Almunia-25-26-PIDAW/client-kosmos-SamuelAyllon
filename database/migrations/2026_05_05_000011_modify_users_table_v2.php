<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('name');
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->text('address')->nullable()->after('date_of_birth');
            $table->json('emergency_contact')->nullable()->after('address');
            $table->text('patient_notes')->nullable()->after('emergency_contact');
            $table->string('stripe_customer_id')->nullable()->after('patient_notes');
            $table->text('google_refresh_token')->nullable()->after('stripe_customer_id');
            $table->text('gdrive_refresh_token')->nullable()->after('google_refresh_token');

            $table->dropColumn([
                'practice_name',
                'specialty',
                'city',
                'default_rate',
                'default_session_duration',
                'nif',
                'fiscal_address',
                'invoice_prefix',
                'invoice_counter',
                'invoice_footer_text',
                'rgpd_template',
                'data_retention_months',
                'privacy_policy_url',
                'role',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'date_of_birth', 'address', 'emergency_contact',
                'patient_notes', 'stripe_customer_id', 'google_refresh_token', 'gdrive_refresh_token',
            ]);

            $table->string('practice_name')->nullable();
            $table->string('specialty')->nullable();
            $table->string('city')->nullable();
            $table->decimal('default_rate', 8, 2)->nullable();
            $table->unsignedSmallInteger('default_session_duration')->default(50);
            $table->string('nif')->nullable();
            $table->text('fiscal_address')->nullable();
            $table->string('invoice_prefix')->default('FAC');
            $table->unsignedInteger('invoice_counter')->default(1);
            $table->text('invoice_footer_text')->nullable();
            $table->text('rgpd_template')->nullable();
            $table->unsignedSmallInteger('data_retention_months')->default(60);
            $table->string('privacy_policy_url')->nullable();
            $table->enum('role', ['professional', 'admin'])->default('professional')->after('password');
        });
    }
};
