<?php

namespace App\Models\Concerns;

use App\Models\Workspace;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToWorkspace
{
    public static function bootBelongsToWorkspace(): void
    {
        static::addGlobalScope('workspace', function (Builder $query) {
            if (auth()->check() && auth()->user()->currentWorkspaceId()) {
                $query->where(
                    (new static)->getTable().'.workspace_id',
                    auth()->user()->currentWorkspaceId()
                );
            }
        });
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }
}
