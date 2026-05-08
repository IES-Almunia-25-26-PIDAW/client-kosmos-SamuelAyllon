<?php

it('redirects guests to login', function () {
    $this->get(route('professional.onboarding'))->assertRedirect(route('login'));
});

it('redirects professionals who have completed the tutorial to dashboard', function () {
    $professional = createProfessional();

    $this->actingAs($professional)
        ->get(route('professional.onboarding'))
        ->assertRedirect(route('professional.dashboard'));
});

it('renders the onboarding page when tutorial is not completed', function () {
    $professional = createProfessional();
    $professional->update(['tutorial_completed_at' => null]);

    $this->actingAs($professional)
        ->get(route('professional.onboarding'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('onboarding', false));
});
