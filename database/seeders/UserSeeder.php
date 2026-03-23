<?php

namespace Database\Seeders;

use App\Models\Idea;
use App\Models\Project;
use App\Models\Resource;
use App\Models\Subscription;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin ──────────────────────────────────────────────
        $admin = User::factory()->create([
            'name'  => 'Admin ClientKosmos',
            'email' => 'admin@clientkosmos.test',
        ]);

        $admin->assignRole('admin');

        Subscription::create([
            'user_id'    => $admin->id,
            'plan'       => 'premium_monthly',
            'status'     => 'active',
            'started_at' => now(),
            'expires_at' => now()->addDays(30),
        ]);

        // ── Premium user ───────────────────────────────────────
        $premium = User::factory()->create([
            'name'  => 'Premium User',
            'email' => 'premium@clientkosmos.test',
        ]);

        $premium->assignRole('premium_user');

        Subscription::create([
            'user_id'    => $premium->id,
            'plan'       => 'premium_monthly',
            'status'     => 'active',
            'started_at' => now(),
            'expires_at' => now()->addDays(30),
        ]);

        // ── Datos demo premium: Cliente 1 — Estudio Alma ──
        $client1 = Project::factory()->active()->create([
            'user_id'     => $premium->id,
            'name'        => 'Estudio Alma',
            'description' => 'Rediseño de marca e identidad visual para estudio de yoga.',
            'color'       => '#8B5CF6',
        ]);

        Task::factory()->highPriority()->create([
            'user_id'    => $premium->id,
            'project_id' => $client1->id,
            'name'       => 'Entregar propuesta de logotipo',
            'due_date'   => now()->addDays(2),
        ]);
        Task::factory()->completed()->create([
            'user_id'    => $premium->id,
            'project_id' => $client1->id,
            'name'       => 'Moodboard inicial',
        ]);
        Task::factory()->create([
            'user_id'    => $premium->id,
            'project_id' => $client1->id,
            'name'       => 'Revisar paleta de colores',
            'priority'   => 'medium',
            'due_date'   => now()->addDays(5),
        ]);

        Idea::factory()->create([
            'user_id'    => $premium->id,
            'project_id' => $client1->id,
            'name'       => 'Usar tipografía serif para transmitir calma',
            'priority'   => 'high',
        ]);
        Idea::factory()->resolved()->create([
            'user_id'    => $premium->id,
            'project_id' => $client1->id,
            'name'       => 'Incluir icono de loto en variante secundaria',
        ]);

        Resource::factory()->create([
            'user_id'    => $premium->id,
            'project_id' => $client1->id,
            'name'       => 'Briefing del cliente',
            'url'        => 'https://drive.google.com/example-briefing',
            'type'       => 'document',
        ]);
        Resource::factory()->create([
            'user_id'    => $premium->id,
            'project_id' => $client1->id,
            'name'       => 'Moodboard en Figma',
            'url'        => 'https://figma.com/file/example-moodboard',
            'type'       => 'link',
        ]);

        // ── Datos demo premium: Cliente 2 — Carlos García ──
        $client2 = Project::factory()->active()->create([
            'user_id'     => $premium->id,
            'name'        => 'Carlos García',
            'description' => 'Desarrollo de app móvil para gestión de citas.',
            'color'       => '#10B981',
        ]);

        Task::factory()->highPriority()->create([
            'user_id'    => $premium->id,
            'project_id' => $client2->id,
            'name'       => 'Mockups pantalla de reservas',
            'due_date'   => now()->addDays(1),
        ]);
        Task::factory()->create([
            'user_id'    => $premium->id,
            'project_id' => $client2->id,
            'name'       => 'Integrar pasarela de pago',
            'priority'   => 'high',
            'due_date'   => now()->addDays(7),
        ]);
        Task::factory()->completed()->create([
            'user_id'    => $premium->id,
            'project_id' => $client2->id,
            'name'       => 'Diseño de wireframes',
        ]);
        Task::factory()->completed()->create([
            'user_id'    => $premium->id,
            'project_id' => $client2->id,
            'name'       => 'Reunión de kick-off',
        ]);

        Idea::factory()->create([
            'user_id'    => $premium->id,
            'project_id' => $client2->id,
            'name'       => 'Añadir notificaciones push para recordatorios',
            'priority'   => 'medium',
        ]);

        Resource::factory()->create([
            'user_id'    => $premium->id,
            'project_id' => $client2->id,
            'name'       => 'Documento de requisitos',
            'url'        => 'https://docs.google.com/example-requisitos',
            'type'       => 'document',
        ]);

        // ── Datos demo premium: Cliente 3 — LegalPro ──
        $client3 = Project::factory()->create([
            'user_id'     => $premium->id,
            'name'        => 'LegalPro',
            'description' => 'Web corporativa para despacho de abogados.',
            'color'       => '#F59E0B',
            'status'      => 'completed',
        ]);

        Task::factory()->completed()->create([
            'user_id'    => $premium->id,
            'project_id' => $client3->id,
            'name'       => 'Diseño homepage',
        ]);
        Task::factory()->completed()->create([
            'user_id'    => $premium->id,
            'project_id' => $client3->id,
            'name'       => 'Sección equipo de abogados',
        ]);

        Idea::factory()->resolved()->create([
            'user_id'    => $premium->id,
            'project_id' => $client3->id,
            'name'       => 'Añadir blog con noticias jurídicas',
        ]);

        // ── Free user ──────────────────────────────────────────
        $free = User::factory()->create([
            'name'  => 'Free User',
            'email' => 'free@clientkosmos.test',
        ]);

        $free->assignRole('free_user');

        Subscription::create([
            'user_id'    => $free->id,
            'plan'       => 'free',
            'status'     => 'active',
            'started_at' => now(),
            'expires_at' => null,
        ]);

        // ── Datos demo free: 1 cliente con pocas tareas ──
        $freeClient = Project::factory()->active()->create([
            'user_id'     => $free->id,
            'name'        => 'Mi primer cliente',
            'description' => 'Proyecto de prueba para explorar ClientKosmos.',
            'color'       => '#6366F1',
        ]);

        Task::factory()->create([
            'user_id'    => $free->id,
            'project_id' => $freeClient->id,
            'name'       => 'Preparar presupuesto',
            'priority'   => 'high',
            'due_date'   => now()->addDays(3),
        ]);
        Task::factory()->create([
            'user_id'    => $free->id,
            'project_id' => $freeClient->id,
            'name'       => 'Enviar contrato',
            'priority'   => 'medium',
            'due_date'   => now()->addDays(5),
        ]);
        Task::factory()->completed()->create([
            'user_id'    => $free->id,
            'project_id' => $freeClient->id,
            'name'       => 'Primera reunión',
        ]);

        Idea::factory()->create([
            'user_id'    => $free->id,
            'project_id' => $freeClient->id,
            'name'       => 'Proponer extensión de alcance',
            'priority'   => 'low',
        ]);
    }
}
