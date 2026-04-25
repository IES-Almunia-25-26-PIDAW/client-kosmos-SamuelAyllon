<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    /**
     * Paciente dueño del documento, o profesional con CaseAssignment activo.
     */
    public function view(User $user, Document $document): bool
    {
        if ($user->id === $document->user_id) {
            return true;
        }

        if ($user->isProfessional()) {
            return $user->caseAssignments()
                ->where('patient_id', $document->patient->user_id ?? 0)
                ->where('status', 'active')
                ->exists();
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isProfessional() || $user->isAdmin();
    }

    public function update(User $user, Document $document): bool
    {
        return $user->id === $document->user_id || $user->isAdmin();
    }

    public function delete(User $user, Document $document): bool
    {
        return $user->id === $document->user_id || $user->isAdmin();
    }

    public function download(User $user, Document $document): bool
    {
        return $this->view($user, $document);
    }
}
