<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GeneratePreSessionBriefing implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        // @todo Find sessions starting within the next 30 minutes and generate pre-session briefings
    }
}
