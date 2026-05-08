<?php

namespace App\Actions\OfferedConsultations;

use App\Models\OfferedConsultation;

class UpdateOfferedConsultation
{
    /**
     * @param  array<string,mixed>  $data
     */
    public function __invoke(OfferedConsultation $consultation, array $data): OfferedConsultation
    {
        $consultation->update($data);

        return $consultation->refresh();
    }
}
