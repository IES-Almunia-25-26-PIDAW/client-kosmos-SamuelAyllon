<?php

use App\Jobs\CheckConsentExpiry;
use App\Jobs\GenerateDailyBriefing;
use App\Jobs\GeneratePreSessionBriefing;
use App\Jobs\SendPaymentReminder;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new GenerateDailyBriefing)->dailyAt('07:30');
Schedule::job(new GeneratePreSessionBriefing)->everyFiveMinutes();
Schedule::job(new SendPaymentReminder)->dailyAt('09:00');
Schedule::job(new CheckConsentExpiry)->weeklyOn(1, '08:00');
