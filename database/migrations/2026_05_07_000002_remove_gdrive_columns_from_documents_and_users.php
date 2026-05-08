<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $cols = array_filter(
                ['gdrive_file_id', 'gdrive_url', 'storage_type'],
                fn ($c) => Schema::hasColumn('documents', $c)
            );
            if (! empty($cols)) {
                $table->dropColumn(array_values($cols));
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'gdrive_refresh_token')) {
                $table->dropColumn('gdrive_refresh_token');
            }
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            if (! Schema::hasColumn('documents', 'storage_type')) {
                $table->enum('storage_type', ['local', 'gdrive'])->default('local')->after('category');
            }
            if (! Schema::hasColumn('documents', 'gdrive_file_id')) {
                $table->string('gdrive_file_id')->nullable()->after('storage_type');
            }
            if (! Schema::hasColumn('documents', 'gdrive_url')) {
                $table->string('gdrive_url')->nullable()->after('gdrive_file_id');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'gdrive_refresh_token')) {
                $table->text('gdrive_refresh_token')->nullable()->after('google_refresh_token');
            }
        });
    }
};
