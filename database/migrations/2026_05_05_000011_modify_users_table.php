<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar_path')->nullable()->after('name');
            $table->string('phone')->nullable()->after('avatar_path');
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->text('address')->nullable()->after('date_of_birth');
            $table->text('patient_notes')->nullable()->after('address');
            $table->string('stripe_customer_id')->nullable()->after('patient_notes');
            $table->text('google_refresh_token')->nullable()->after('stripe_customer_id');
            $table->text('gdrive_refresh_token')->nullable()->after('google_refresh_token');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar_path', 'phone', 'date_of_birth', 'address',
                'patient_notes', 'stripe_customer_id', 'google_refresh_token', 'gdrive_refresh_token',
                'deleted_at',
            ]);
        });
    }
};
