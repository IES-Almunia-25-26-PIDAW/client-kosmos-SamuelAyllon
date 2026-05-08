<?php

namespace Database\Factories;

use App\Models\SessionRecording;
use App\Models\TranscriptionSegment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TranscriptionSegment>
 */
class TranscriptionSegmentFactory extends Factory
{
    protected $model = TranscriptionSegment::class;

    public function definition(): array
    {
        $start = $this->faker->numberBetween(0, 600_000);

        return [
            'session_recording_id' => SessionRecording::factory(),
            'speaker_user_id' => User::factory(),
            'position' => $this->faker->numberBetween(0, 50),
            'started_at_ms' => $start,
            'ended_at_ms' => $start + 8000,
            'text' => $this->faker->sentence(),
        ];
    }
}
