<?php

namespace App\Models\Concerns;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToClinic
{
    public static function bootBelongsToClinic(): void
    {
        static::addGlobalScope('clinic', function (Builder $query) {
            if (auth()->check() && auth()->user()->currentClinicId()) {
                $query->where(
                    (new static)->getTable().'.clinic_id',
                    auth()->user()->currentClinicId()
                );
            }
        });
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}
