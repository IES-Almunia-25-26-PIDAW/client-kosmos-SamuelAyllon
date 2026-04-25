<?php

use Illuminate\Support\Facades\Storage;

it('deletes audio chunks older than the retention window', function () {
    Storage::fake('audio_chunks');

    $disk = Storage::disk('audio_chunks');
    $disk->put('old.webm', 'old-data');
    $disk->put('fresh.webm', 'fresh-data');

    touch($disk->path('old.webm'), now()->subHours(48)->getTimestamp());

    $this->artisan('audio:cleanup')->assertExitCode(0);

    expect($disk->exists('old.webm'))->toBeFalse();
    expect($disk->exists('fresh.webm'))->toBeTrue();
});

it('respects the hours option for retention window', function () {
    Storage::fake('audio_chunks');

    $disk = Storage::disk('audio_chunks');
    $disk->put('two-hours-old.webm', 'data');

    touch($disk->path('two-hours-old.webm'), now()->subHours(2)->getTimestamp());

    $this->artisan('audio:cleanup', ['--hours' => 1])->assertExitCode(0);

    expect($disk->exists('two-hours-old.webm'))->toBeFalse();
});
