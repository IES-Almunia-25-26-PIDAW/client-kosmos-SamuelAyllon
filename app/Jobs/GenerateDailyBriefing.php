<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateDailyBriefing implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        // @todo Generate daily briefings for all active users
    }
}
