<?php

use App\Models\KosmoBriefing;

it('redirects guests from kosmo to login', function () {
    $this->get(route('kosmo'))->assertRedirect(route('login'));
});

it('professional can view kosmo page', function () {
    $this->actingAs(createProfessional())
        ->get(route('kosmo'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('kosmo/index'));
});

it('kosmo page returns unread briefings', function () {
    $user = createProfessional();

    KosmoBriefing::create([
        'user_id'  => $user->id,
        'type'     => 'daily',
        'content'  => ['text' => 'Briefing del día'],
        'for_date' => today(),
        'is_read'  => false,
    ]);

    $this->actingAs($user)
        ->get(route('kosmo'))
        ->assertInertia(fn ($page) => $page
            ->component('kosmo/index')
            ->has('briefings', 1)
        );
});

it('kosmo page does not return read briefings', function () {
    $user = createProfessional();

    KosmoBriefing::create([
        'user_id'  => $user->id,
        'type'     => 'daily',
        'content'  => ['text' => 'Briefing leído'],
        'for_date' => today(),
        'is_read'  => true,
    ]);

    $this->actingAs($user)
        ->get(route('kosmo'))
        ->assertInertia(fn ($page) => $page
            ->component('kosmo/index')
            ->has('briefings', 0)
        );
});

it('professional can mark a briefing as read', function () {
    $user = createProfessional();

    $briefing = KosmoBriefing::create([
        'user_id'  => $user->id,
        'type'     => 'daily',
        'content'  => ['text' => 'Briefing'],
        'for_date' => today(),
        'is_read'  => false,
    ]);

    $this->actingAs($user)
        ->post(route('kosmo.briefings.read', $briefing))
        ->assertRedirect();

    $this->assertDatabaseHas('kosmo_briefings', [
        'id'      => $briefing->id,
        'is_read' => true,
    ]);
});

it('professional cannot mark another users briefing as read', function () {
    $user = createProfessional();
    $other = createProfessional();

    $briefing = KosmoBriefing::create([
        'user_id'  => $other->id,
        'type'     => 'daily',
        'content'  => ['text' => 'Briefing ajeno'],
        'for_date' => today(),
        'is_read'  => false,
    ]);

    $this->actingAs($user)
        ->post(route('kosmo.briefings.read', $briefing))
        ->assertForbidden();
});

it('redirects guests from kosmo chat to login when not authenticated', function () {
    $this->post(route('kosmo.chat'), ['message' => 'Hola'])->assertRedirect(route('login'));
});
