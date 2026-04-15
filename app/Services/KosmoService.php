<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\PatientProfile;
use App\Models\User;

class KosmoService
{
    /**
     * @todo Generate a daily briefing for the user with appointment agenda, alerts, and key reminders
     */
    public function generateDailyBriefing(User $user): void
    {
        // @todo
    }

    /**
     * @todo Generate a pre-session briefing for the patient, summarizing last appointment,
     *       open agreements, invoice status and key notes
     */
    public function generatePreSessionBriefing(PatientProfile $patient, Appointment $appointment): void
    {
        // @todo
    }

    /**
     * @todo Generate a post-session briefing summarizing what was discussed and agreed
     */
    public function generatePostSessionBriefing(Appointment $appointment): void
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
