<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class CleanupAudioChunks extends Command
{
    protected $signature = 'audio:cleanup {--hours=24 : Eliminar chunks con más antigüedad que este número de horas}';

    protected $description = 'Borra chunks de audio antiguos del disco audio_chunks (RGPD: retención máxima 24h)';

    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        $cutoff = Carbon::now()->subHours($hours)->getTimestamp();

        $disk = Storage::disk('audio_chunks');
        $deleted = 0;

        foreach ($disk->allFiles() as $file) {
            if ($disk->lastModified($file) < $cutoff) {
                $disk->delete($file);
                $deleted++;
            }
        }

        $this->info(sprintf('audio:cleanup → %d chunk(s) eliminados (>%dh).', $deleted, $hours));

        return self::SUCCESS;
    }
}
