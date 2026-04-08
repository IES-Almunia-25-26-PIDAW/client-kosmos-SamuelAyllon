<?php

namespace App\Services;

use App\Models\ConsultingSession;
use App\Models\Patient;
use App\Models\User;

class KosmoService
{
    /**
     * @todo Generate a daily briefing for the user with session agenda, alerts, and key reminders
     */
    public function generateDailyBriefing(User $user): void
    {
        // @todo
    }

    /**
     * @todo Generate a pre-session briefing for the patient, summarizing last session,
     *       open agreements, payment status and key notes
     */
    public function generatePreSessionBriefing(Patient $patient, ConsultingSession $session): void
    {
        // @todo
    }

    /**
     * @todo Generate a post-session briefing summarizing what was discussed and agreed
     */
    public function generatePostSessionBriefing(ConsultingSession $session): void
    {
        // @todo
    }

    /**
     * @todo Handle a chat message from the user, returning Kosmo's response
     */
    public function chat(User $user, string $message): string
    {
        // @todo
        return '';
    }
}
