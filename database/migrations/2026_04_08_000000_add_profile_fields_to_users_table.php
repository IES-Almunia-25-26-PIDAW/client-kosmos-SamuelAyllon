<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('practice_name')->nullable()->after('name');
            $table->string('specialty')->nullable();
            $table->string('city')->nullable();
            $table->string('avatar_path')->nullable();
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
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'practice_name', 'specialty', 'city', 'avatar_path',
                'default_rate', 'default_session_duration', 'nif', 'fiscal_address',
                'invoice_prefix', 'invoice_counter', 'invoice_footer_text',
                'rgpd_template', 'data_retention_months', 'privacy_policy_url',
                'role', 'deleted_at',
            ]);
        });
    }
};
