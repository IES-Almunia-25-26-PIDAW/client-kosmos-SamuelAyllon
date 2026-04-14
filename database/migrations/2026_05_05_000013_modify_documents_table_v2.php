<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('clinic_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            $table->enum('storage_type', ['local', 'gdrive'])->default('local')->after('file_path');
            $table->string('gdrive_file_id')->nullable()->after('storage_type');
            $table->string('gdrive_url')->nullable()->after('gdrive_file_id');
            $table->renameColumn('file_path', 'local_path');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->renameColumn('local_path', 'file_path');
            $table->dropForeign(['clinic_id']);
            $table->dropColumn(['clinic_id', 'storage_type', 'gdrive_file_id', 'gdrive_url']);
        });
    }
};
