<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\User;
use Google\Client as GoogleClient;
use Google\Service\Calendar;
use Google\Service\Calendar\ConferenceData;
use Google\Service\Calendar\ConferenceSolutionKey;
use Google\Service\Calendar\CreateConferenceRequest;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventAttendee;
use Google\Service\Calendar\EventDateTime;
use Illuminate\Support\Str;

class GoogleCalendarService
{
    private function makeClient(User $professional): GoogleClient
    {
        $client = new GoogleClient;
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect_uri'));
        $client->addScope(Calendar::CALENDAR_EVENTS);
        $client->setAccessType('offline');

        $client->setAccessToken([
            'refresh_token' => $professional->google_refresh_token,
            'access_token' => '',
            'expires_in' => 0,
        ]);

        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($professional->google_refresh_token);
        }

        return $client;
    }

    /**
     * Create a Google Meet event on the professional's calendar.
     *
     * @return array{event_id: string, meet_url: string}
     */
    public function createMeetEvent(Appointment $appointment): array
    {
        $appointment->loadMissing(['professional', 'patient']);
        $professional = $appointment->professional;

        if ($professional === null || $professional->google_refresh_token === null) {
            throw new \RuntimeException('El profesional no tiene cuenta Google conectada.');
        }

        $client = $this->makeClient($professional);
        $service = new Calendar($client);

        $attendees = [
            (new EventAttendee)->setEmail($professional->email),
        ];

        if ($appointment->patient?->email !== null) {
            $attendees[] = (new EventAttendee)->setEmail($appointment->patient->email);
        }

        $conferenceKey = new ConferenceSolutionKey;
        $conferenceKey->setType('hangoutsMeet');

        $conferenceRequest = new CreateConferenceRequest;
        $conferenceRequest->setRequestId(Str::uuid()->toString());
        $conferenceRequest->setConferenceSolutionKey($conferenceKey);

        $conferenceData = new ConferenceData;
        $conferenceData->setCreateRequest($conferenceRequest);

        $event = new Event([
            'summary' => 'Consulta ClientKosmos',
            'description' => 'Sesión terapéutica — ClientKosmos',
            'start' => (new EventDateTime)
                ->setDateTime($appointment->starts_at->toRfc3339String())
                ->setTimeZone(config('app.timezone', 'Europe/Madrid')),
            'end' => (new EventDateTime)
                ->setDateTime($appointment->ends_at->toRfc3339String())
                ->setTimeZone(config('app.timezone', 'Europe/Madrid')),
            'attendees' => $attendees,
            'conferenceData' => $conferenceData,
            'reminders' => ['useDefault' => false],
        ]);

        $created = $service->events->insert('primary', $event, ['conferenceDataVersion' => 1]);

        $meetUrl = $created->getHangoutLink() ?? '';

        return [
            'event_id' => $created->getId(),
            'meet_url' => $meetUrl,
        ];
    }

    /**
     * Build the OAuth authorization URL to connect a professional's Google account.
     */
    public function getAuthorizationUrl(): string
    {
        $client = new GoogleClient;
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect_uri'));
        $client->addScope(Calendar::CALENDAR_EVENTS);
        $client->setAccessType('offline');
        $client->setPrompt('consent');

        return $client->createAuthUrl();
    }

    /**
     * Exchange the OAuth code for a refresh token.
     */
    public function exchangeCode(string $code): string
    {
        $client = new GoogleClient;
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect_uri'));

        $token = $client->fetchAccessTokenWithAuthCode($code);

        if (isset($token['error'])) {
            throw new \RuntimeException('Google OAuth error: '.$token['error_description']);
        }

        return $token['refresh_token'] ?? throw new \RuntimeException('No refresh_token returned by Google.');
    }
}
