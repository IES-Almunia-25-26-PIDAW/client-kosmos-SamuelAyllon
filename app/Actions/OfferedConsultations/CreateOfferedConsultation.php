<?php

namespace App\Actions\OfferedConsultations;

use App\Models\OfferedConsultation;
use App\Models\ProfessionalProfile;

class CreateOfferedConsultation
{
    /**
     * @param  array{name:string,description?:?string,duration_minutes:int,price?:?numeric,color?:?string,is_active?:bool,modality?:string}  $data
     */
    public function __invoke(ProfessionalProfile $profile, array $data): OfferedConsultation
    {
        return $profile->offeredConsultations()->create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'duration_minutes' => $data['duration_minutes'],
            'price' => $data['price'] ?? null,
            'color' => $data['color'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'modality' => $data['modality'] ?? 'both',
        ]);
    }
}
