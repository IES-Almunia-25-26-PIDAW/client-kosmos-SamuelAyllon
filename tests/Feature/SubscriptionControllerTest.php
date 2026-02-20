<?php

use App\Models\Subscription;

it('redirects guests from subscription page to login', function () {
    $this->get(route('subscription.index'))->assertRedirect(route('login'));
});

it('free user can view subscription page', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->get(route('subscription.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('subscription/index'));
});

it('premium user can view subscription page', function () {
    $user = createPremiumUser();

    $this->actingAs($user)
        ->get(route('subscription.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('subscription/index'));
});

it('subscription page shows available plans', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->get(route('subscription.index'))
        ->assertInertia(fn ($page) => $page
            ->component('subscription/index')
            ->has('plans', 3)
        );
});
