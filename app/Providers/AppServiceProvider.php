<?php

namespace App\Providers;

use App\Http\Responses\LoginResponse;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\PatientProfile;
use App\Models\SessionRecording;
use App\Models\User;
use App\Observers\PatientObserver;
use App\Observers\PaymentObserver;
use App\Policies\AdminPolicy;
use App\Policies\DocumentPolicy;
use App\Policies\PatientPolicy;
use App\Policies\PaymentPolicy;
use App\Policies\SessionRecordingPolicy;
use Carbon\CarbonImmutable;
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use OpenAI;
use OpenAI\Client as OpenAIClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Usar nuestro LoginResponse personalizado (redirección por rol)
        $this->app->singleton(LoginResponseContract::class, LoginResponse::class);

        // Cliente OpenAI apuntando a Groq
        $this->app->singleton(OpenAIClient::class, function () {
            $factory = OpenAI::factory()
                ->withApiKey(config('services.groq.api_key') ?? '')
                ->withBaseUri(config('services.groq.base_url'));

            // En Windows, cURL no trae CA bundle — usar el descargado
            $caBundle = config('services.groq.ca_bundle');
            if ($caBundle && file_exists($caBundle)) {
                $factory = $factory->withHttpClient(
                    new GuzzleClient(['verify' => $caBundle])
                );
            }

            return $factory->make();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        PatientProfile::observe(PatientObserver::class);
        Invoice::observe(PaymentObserver::class);

        Gate::policy(User::class, AdminPolicy::class);
        Gate::policy(PatientProfile::class, PatientPolicy::class);
        Gate::policy(Invoice::class, PaymentPolicy::class);
        Gate::policy(Document::class, DocumentPolicy::class);
        Gate::policy(SessionRecording::class, SessionRecordingPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
