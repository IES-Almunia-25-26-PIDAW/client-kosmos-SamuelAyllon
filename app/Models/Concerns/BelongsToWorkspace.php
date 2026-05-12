<?php

namespace App\Models\Concerns;

use App\Models\Workspace;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToWorkspace
{
    public static function bootBelongsToWorkspace(): void
    {
        static::addGlobalScope('workspace', function (Builder $query) {
            if (auth()->check() && auth()->user()->currentWorkspaceId()) {
                /** @phpstan-ignore-next-line new.static */
                $instance = new static;
                $query->where(
                    $instance->getTable().'.workspace_id',
                    auth()->user()->currentWorkspaceId()
                );
            }
        });
    }

    /** @return BelongsTo<Workspace, $this> */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}
