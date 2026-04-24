<?php

use Illuminate\Database\Migrations\Migration;

/**
 * This migration is a no-op: the rejected_no_consent value was added to the
 * create_session_recordings_table migration directly (2026_05_05_000006).
 * For existing MySQL deployments, run the SQL below manually:
 *   ALTER TABLE session_recordings MODIFY transcription_status
 *     ENUM('pending','processing','completed','failed','rejected_no_consent') DEFAULT 'pending';
 */
return new class extends Migration
{
    public function up(): void {}

    public function down(): void {}
};
