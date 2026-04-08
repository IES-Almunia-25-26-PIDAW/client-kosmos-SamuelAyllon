<?php

namespace Database\Seeders;

use App\Models\Agreement;
use App\Models\ConsentForm;
use App\Models\ConsultingSession;
use App\Models\Note;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        if (User::where('email', 'admin@clientkosmos.test')->exists()) {
            $this->command->info('Users already seeded. Skipping.');
            return;
        }

        // ══════════════════════════════════════════════════
        //  ADMIN
        // ══════════════════════════════════════════════════
        $admin = User::create([
            'name'              => 'Admin ClientKosmos',
            'email'             => 'admin@clientkosmos.test',
            'password'          => Hash::make('password'),
            'role'              => 'admin',
            'email_verified_at' => now(),
            'practice_name'     => 'ClientKosmos HQ',
            'specialty'         => 'Administración',
            'city'              => 'Madrid',
        ]);

        $admin->assignRole('admin');

        // ══════════════════════════════════════════════════
        //  PROFESSIONAL — Natalia López
        // ══════════════════════════════════════════════════
        $pro = User::create([
            'name'                      => 'Natalia Ayllón',
            'email'                     => 'natalia@clientkosmos.test',
            'password'                  => Hash::make('password'),
            'role'                      => 'professional',
            'email_verified_at'         => now(),
            'tutorial_completed_at'     => now(),
            'practice_name'             => 'Consulta Natalia Ayllón',
            'specialty'                 => 'Psicología clínica',
            'city'                      => 'Barcelona',
            'default_rate'              => 70.00,
            'default_session_duration'  => 50,
            'nif'                       => '12345678Z',
            'fiscal_address'            => 'Calle Mayor 10, 2ºA, 08001 Barcelona',
            'invoice_prefix'            => 'FAC',
            'invoice_counter'           => 1,
            'rgpd_template'             => 'En cumplimiento del RGPD (UE) 2016/679, le informamos que sus datos serán tratados con la única finalidad de prestar el servicio de psicoterapia, y no serán cedidos a terceros sin su consentimiento expreso.',
            'data_retention_months'     => 60,
        ]);

        $pro->assignRole('professional');

        // ── Paciente 1: Ana García — estado normalizado ──
        $p1 = Patient::create([
            'user_id'            => $pro->id,
            'project_name'       => 'Ana García',
            'email'              => 'ana.garcia@ejemplo.com',
            'phone'              => '+34 612 345 678',
            'brand_tone'         => 'TCC',
            'service_scope'      => 'Trastorno de ansiedad generalizada. Lleva 6 meses en tratamiento con evolución positiva.',
            'next_deadline'      => now()->addDays(7)->toDateString(),
            'is_active'          => true,
            'payment_status'     => 'paid',
            'has_valid_consent'  => true,
            'has_open_agreement' => false,
        ]);

        ConsentForm::create([
            'patient_id'       => $p1->id,
            'user_id'          => $pro->id,
            'template_version' => '1.0',
            'content_snapshot' => $pro->rgpd_template,
            'status'           => 'signed',
            'signed_at'        => now()->subMonths(5),
            'signed_ip'        => '127.0.0.1',
            'expires_at'       => now()->addMonths(7)->toDateString(),
        ]);

        $s1a = ConsultingSession::create([
            'patient_id'    => $p1->id,
            'user_id'       => $pro->id,
            'scheduled_at'  => now()->subWeeks(2),
            'started_at'    => now()->subWeeks(2),
            'ended_at'      => now()->subWeeks(2)->addMinutes(50),
            'duration_minutes' => 50,
            'status'        => 'completed',
            'ai_summary'    => 'La paciente reportó mejora en las técnicas de respiración. Se exploró la raíz del pensamiento catastrófico.',
        ]);
        $s1b = ConsultingSession::create([
            'patient_id'    => $p1->id,
            'user_id'       => $pro->id,
            'scheduled_at'  => now()->subWeek(),
            'started_at'    => now()->subWeek(),
            'ended_at'      => now()->subWeek()->addMinutes(50),
            'duration_minutes' => 50,
            'status'        => 'completed',
            'ai_summary'    => 'Se trabajó el registro de pensamientos automáticos. La paciente completó las tareas asignadas.',
        ]);
        ConsultingSession::create([
            'patient_id'   => $p1->id,
            'user_id'      => $pro->id,
            'scheduled_at' => now()->addDays(7),
            'status'       => 'scheduled',
        ]);

        Note::create([
            'patient_id'            => $p1->id,
            'user_id'               => $pro->id,
            'consulting_session_id' => $s1a->id,
            'content'               => 'Progreso notable en el manejo de las situaciones de estrés. Mantiene el diario de pensamientos.',
            'type'                  => 'session_note',
        ]);
        Note::create([
            'patient_id' => $p1->id,
            'user_id'    => $pro->id,
            'content'    => 'Llamó para comentar que tuvo un momento de ansiedad en el trabajo. Se le recordaron las técnicas de grounding.',
            'type'       => 'quick_note',
        ]);

        Agreement::create([
            'patient_id'            => $p1->id,
            'user_id'               => $pro->id,
            'consulting_session_id' => $s1b->id,
            'content'               => 'Practicar la técnica 5-4-3-2-1 cuando sienta ansiedad en el trabajo.',
            'is_completed'          => true,
            'completed_at'          => now()->subDays(3),
        ]);

        Payment::create([
            'patient_id'     => $p1->id,
            'user_id'        => $pro->id,
            'amount'         => 70.00,
            'concept'        => 'Sesión de psicología #5',
            'payment_method' => 'bizum',
            'status'         => 'paid',
            'due_date'       => now()->subWeeks(2)->toDateString(),
            'paid_at'        => now()->subWeeks(2),
        ]);
        Payment::create([
            'patient_id'     => $p1->id,
            'user_id'        => $pro->id,
            'amount'         => 70.00,
            'concept'        => 'Sesión de psicología #6',
            'payment_method' => 'bizum',
            'status'         => 'paid',
            'due_date'       => now()->subWeek()->toDateString(),
            'paid_at'        => now()->subWeek(),
        ]);

        // ── Paciente 2: Marcos Ruiz — cobro pendiente + acuerdo abierto ──
        $p2 = Patient::create([
            'user_id'            => $pro->id,
            'project_name'       => 'Marcos Ruiz',
            'email'              => 'marcos.ruiz@ejemplo.com',
            'phone'              => '+34 622 111 222',
            'brand_tone'         => 'EMDR',
            'service_scope'      => 'Estrés post-traumático. Episodio de accidente de tráfico hace 8 meses.',
            'next_deadline'      => now()->addDays(3)->toDateString(),
            'is_active'          => true,
            'payment_status'     => 'pending',
            'has_valid_consent'  => true,
            'has_open_agreement' => true,
        ]);

        ConsentForm::create([
            'patient_id'       => $p2->id,
            'user_id'          => $pro->id,
            'template_version' => '1.0',
            'content_snapshot' => $pro->rgpd_template,
            'status'           => 'signed',
            'signed_at'        => now()->subMonths(3),
            'signed_ip'        => '127.0.0.1',
            'expires_at'       => now()->addMonths(9)->toDateString(),
        ]);

        $s2a = ConsultingSession::create([
            'patient_id'      => $p2->id,
            'user_id'         => $pro->id,
            'scheduled_at'    => now()->subDays(10),
            'started_at'      => now()->subDays(10),
            'ended_at'        => now()->subDays(10)->addMinutes(60),
            'duration_minutes'=> 60,
            'status'          => 'completed',
        ]);
        ConsultingSession::create([
            'patient_id'   => $p2->id,
            'user_id'      => $pro->id,
            'scheduled_at' => now()->addDays(3),
            'status'       => 'scheduled',
        ]);

        Note::create([
            'patient_id'            => $p2->id,
            'user_id'               => $pro->id,
            'consulting_session_id' => $s2a->id,
            'content'               => 'Primera sesión de EMDR. El paciente toleró bien la estimulación bilateral. Reducción leve de la intensidad del recuerdo traumático.',
            'type'                  => 'session_note',
        ]);

        Agreement::create([
            'patient_id'            => $p2->id,
            'user_id'               => $pro->id,
            'consulting_session_id' => $s2a->id,
            'content'               => 'Escribir en el diario 10 minutos cada noche sobre las emociones del día.',
            'is_completed'          => false,
        ]);

        Payment::create([
            'patient_id' => $p2->id,
            'user_id'    => $pro->id,
            'amount'     => 80.00,
            'concept'    => 'Sesión EMDR #3',
            'status'     => 'pending',
            'due_date'   => now()->subDays(5)->toDateString(),
        ]);

        // ── Paciente 3: Laura Sánchez — sin consentimiento + cobro vencido ──
        $p3 = Patient::create([
            'user_id'            => $pro->id,
            'project_name'       => 'Laura Sánchez',
            'email'              => 'laura.sanchez@ejemplo.com',
            'brand_tone'         => 'Terapia humanista',
            'service_scope'      => 'Duelo por pérdida familiar. Primera consulta hace 2 semanas.',
            'next_deadline'      => now()->addDays(10)->toDateString(),
            'is_active'          => true,
            'payment_status'     => 'overdue',
            'has_valid_consent'  => false,
            'has_open_agreement' => false,
        ]);

        ConsultingSession::create([
            'patient_id'      => $p3->id,
            'user_id'         => $pro->id,
            'scheduled_at'    => now()->subDays(14),
            'started_at'      => now()->subDays(14),
            'ended_at'        => now()->subDays(14)->addMinutes(50),
            'duration_minutes'=> 50,
            'status'          => 'completed',
        ]);
        ConsultingSession::create([
            'patient_id'   => $p3->id,
            'user_id'      => $pro->id,
            'scheduled_at' => now()->addDays(10),
            'status'       => 'scheduled',
        ]);

        Note::create([
            'patient_id' => $p3->id,
            'user_id'    => $pro->id,
            'content'    => 'Primera sesión de evaluación. La paciente se muestra con poca energía y cierta resistencia a hablar del fallecimiento. Buen rapport inicial.',
            'type'       => 'session_note',
        ]);

        Payment::create([
            'patient_id' => $p3->id,
            'user_id'    => $pro->id,
            'amount'     => 70.00,
            'concept'    => 'Primera consulta',
            'status'     => 'overdue',
            'due_date'   => now()->subDays(10)->toDateString(),
        ]);

        // ── Paciente 4: Javier Moreno — alta, todo en regla ──
        $p4 = Patient::create([
            'user_id'            => $pro->id,
            'project_name'       => 'Javier Moreno',
            'email'              => 'javier.moreno@ejemplo.com',
            'phone'              => '+34 633 555 444',
            'brand_tone'         => 'Terapia cognitivo-conductual',
            'service_scope'      => 'Fobia social. Alta dada en el mes anterior tras 8 meses de tratamiento exitoso.',
            'is_active'          => false,
            'payment_status'     => 'paid',
            'has_valid_consent'  => true,
            'has_open_agreement' => false,
        ]);

        ConsentForm::create([
            'patient_id'       => $p4->id,
            'user_id'          => $pro->id,
            'template_version' => '1.0',
            'content_snapshot' => $pro->rgpd_template,
            'status'           => 'signed',
            'signed_at'        => now()->subMonths(8),
            'signed_ip'        => '127.0.0.1',
            'expires_at'       => now()->addMonths(4)->toDateString(),
        ]);

        Payment::create([
            'patient_id'     => $p4->id,
            'user_id'        => $pro->id,
            'amount'         => 70.00,
            'concept'        => 'Sesión de cierre',
            'payment_method' => 'transfer',
            'status'         => 'paid',
            'due_date'       => now()->subMonth()->toDateString(),
            'paid_at'        => now()->subMonth(),
        ]);

        $this->command->info('Users seeded successfully.');
        $this->command->info('  admin@clientkosmos.test   / password');
        $this->command->info('  natalia@clientkosmos.test / password');
    }
}
