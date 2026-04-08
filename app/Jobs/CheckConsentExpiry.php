<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CheckConsentExpiry implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        // @todo Mark expired consent forms and notify affected users
    }
}
