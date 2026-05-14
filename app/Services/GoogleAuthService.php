<?php

namespace App\Services;

use Google\Client as GoogleClient;
use Google\Service\Calendar;
use Google\Service\Oauth2;
use RuntimeException;

class GoogleAuthService
{
    /** @var list<string> */
    private const SCOPES = ['openid', 'email', 'profile', Calendar::CALENDAR_EVENTS];

    public function createAuthUrl(string $state): string
    {
        $client = $this->newClient();
        $client->setState($state);
        $client->setAccessType('offline');
        $client->setIncludeGrantedScopes(true);
        $client->setPrompt('consent select_account');

        return $client->createAuthUrl();
    }

    /**
     * Exchange the authorization code for user info and a refresh token.
     *
     * @return array{
     *   google_id: string,
     *   email: string,
     *   name: string,
     *   avatar_url: ?string,
     *   email_verified: bool,
     *   refresh_token: ?string
     * }
     */
    public function handleCallback(string $code): array
    {
        $client = $this->newClient();
        $token = $client->fetchAccessTokenWithAuthCode($code);

        if (isset($token['error'])) {
            throw new RuntimeException('Google OAuth error: '.$token['error']);
        }

        $oauth = new Oauth2($client);
        $info = $oauth->userinfo->get();

        $googleId = $info->getId();
        $email = $info->getEmail();

        if ($googleId === null || $email === null) {
            throw new RuntimeException('Google account is missing required fields.');
        }

        return [
            'google_id' => $googleId,
            'email' => $email,
            'name' => $info->getName() ?? $email,
            'avatar_url' => $info->getPicture(),
            'email_verified' => (bool) $info->getVerifiedEmail(),
            'refresh_token' => $token['refresh_token'] ?? null,
        ];
    }

    private function newClient(): GoogleClient
    {
        $client = new GoogleClient;
        $client->setClientId((string) config('services.google.client_id'));
        $client->setClientSecret((string) config('services.google.client_secret'));
        $client->setRedirectUri((string) config('services.google.auth_redirect_uri'));

        foreach (self::SCOPES as $scope) {
            $client->addScope($scope);
        }

        return $client;
    }
}
