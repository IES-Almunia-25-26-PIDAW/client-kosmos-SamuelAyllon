<?php

use App\Models\Document;

it('redirects guests to login', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);
    $document = Document::factory()->create(['patient_id' => $patient->id]);

    $this->delete(route('professional.patients.documents.destroy', [$patient, $document]))
        ->assertRedirect(route('login'));
});

it('professional can delete a patient document', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);
    $document = Document::factory()->create(['patient_id' => $patient->id]);

    $this->actingAs($professional)
        ->delete(route('professional.patients.documents.destroy', [$patient, $document]))
        ->assertRedirect();

    $this->assertSoftDeleted('documents', ['id' => $document->id]);
});

it('forbids deleting document for unrelated patient', function () {
    $professional = createProfessional();
    $other = createProfessional();
    $patient = createPatientProfileFor($other);
    $document = Document::factory()->create(['patient_id' => $patient->id]);

    $this->actingAs($professional)
        ->delete(route('professional.patients.documents.destroy', [$patient, $document]))
        ->assertForbidden();
});
