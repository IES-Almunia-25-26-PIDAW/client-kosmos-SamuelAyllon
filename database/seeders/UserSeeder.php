<?php

namespace Database\Seeders;

use App\Models\Agreement;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\ConsentForm;
use App\Models\ConsultingSession;
use App\Models\Note;
use App\Models\PatientProfile;
use App\Models\Payment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // ══════════════════════════════════════════════════
        //  OWNER / PROFESSIONAL — Natalia López
        // ══════════════════════════════════════════════════
        $owner = User::create([
            'name'                  => 'Natalia Ayllón',
            'email'                 => 'natalia@clientkosmos.test',
            'password'              => Hash::make('password'),
            'email_verified_at'     => now(),
            'tutorial_completed_at' => now(),
            'phone'                 => '+34 600 000 001',
        ]);
        $owner->assignRole('owner');

        $clinic = Clinic::create([
            'owner_id'    => $owner->id,
            'name'        => 'Consulta Natalia Ayllón',
            'slug'        => 'consulta-natalia-ayllon',
            'tax_name'    => 'Natalia Ayllón López',
            'tax_id'      => '12345678Z',
            'tax_address' => 'Calle Mayor 10, 2ºA, 08001 Barcelona',
            'phone'       => '+34 600 000 001',
            'email'       => 'natalia@clientkosmos.test',
        ]);

        $clinic->users()->attach($owner->id, [
            'role'                 => 'owner',
            'can_view_all_patients'=> true,
            'joined_at'            => now(),
            'is_active'            => true,
        ]);

        $serviceSession = Service::create([
            'clinic_id'        => $clinic->id,
            'name'             => 'Sesión de psicología',
            'description'      => 'Sesión individual de psicoterapia (50 min)',
            'duration_minutes' => 50,
            'price'            => 70.00,
            'color'            => '#6366f1',
            'is_active'        => true,
        ]);

        Service::create([
            'clinic_id'        => $clinic->id,
            'name'             => 'Sesión EMDR',
            'description'      => 'Sesión especializada EMDR (60 min)',
            'duration_minutes' => 60,
            'price'            => 80.00,
            'color'            => '#8b5cf6',
            'is_active'        => true,
        ]);

        // ══════════════════════════════════════════════════
        //  PROFESSIONAL ADICIONAL — Carlos Vega
        // ══════════════════════════════════════════════════
        $pro2 = User::create([
            'name'                  => 'Carlos Vega',
            'email'                 => 'carlos@clientkosmos.test',
            'password'              => Hash::make('password'),
            'email_verified_at'     => now(),
            'tutorial_completed_at' => now(),
            'phone'                 => '+34 600 000 002',
        ]);
        $pro2->assignRole('professional');

        $clinic->users()->attach($pro2->id, [
            'role'                 => 'professional',
            'can_view_all_patients'=> false,
            'joined_at'            => now()->subMonths(2),
            'is_active'            => true,
        ]);

        // ══════════════════════════════════════════════════
        //  PACIENTE 1 — Ana García (todo en regla)
        // ══════════════════════════════════════════════════
        $patientUser1 = User::create([
            'name'              => 'Ana García',
            'email'             => 'ana.garcia@ejemplo.com',
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
            'phone'             => '+34 612 345 678',
        ]);
        $patientUser1->assignRole('patient');

        $p1 = PatientProfile::withoutGlobalScopes()->create([
            'user_id'          => $patientUser1->id,
            'clinic_id'        => $clinic->id,
            'professional_id'  => $owner->id,
            'email'            => 'ana.garcia@ejemplo.com',
            'phone'            => '+34 612 345 678',
            'is_active'        => true,
            'clinical_notes'   => 'Trastorno de ansiedad generalizada. Lleva 6 meses en tratamiento con evolución positiva.',
            'diagnosis'        => 'Trastorno de ansiedad generalizada (F41.1)',
            'treatment_plan'   => 'TCC con técnicas de regulación emocional. Frecuencia quincenal.',
            'status'           => 'active',
            'first_session_at' => now()->subMonths(6),
            'last_session_at'  => now()->subWeek(),
        ]);

        ConsentForm::create([
            'patient_id'       => $p1->id,
            'user_id'          => $owner->id,
            'template_version' => '1.0',
            'content_snapshot' => 'En cumplimiento del RGPD (UE) 2016/679, sus datos serán tratados con la única finalidad de prestar el servicio de psicoterapia.',
            'status'           => 'signed',
            'signed_at'        => now()->subMonths(5),
            'signed_ip'        => '127.0.0.1',
            'expires_at'       => now()->addMonths(7)->toDateString(),
        ]);

        $s1a = ConsultingSession::create([
            'patient_id'       => $p1->id,
            'user_id'          => $owner->id,
            'scheduled_at'     => now()->subWeeks(2),
            'started_at'       => now()->subWeeks(2),
            'ended_at'         => now()->subWeeks(2)->addMinutes(50),
            'duration_minutes' => 50,
            'status'           => 'completed',
            'ai_summary'       => 'La paciente reportó mejora en las técnicas de respiración. Se exploró la raíz del pensamiento catastrófico.',
        ]);

        $s1b = ConsultingSession::create([
            'patient_id'       => $p1->id,
            'user_id'          => $owner->id,
            'scheduled_at'     => now()->subWeek(),
            'started_at'       => now()->subWeek(),
            'ended_at'         => now()->subWeek()->addMinutes(50),
            'duration_minutes' => 50,
            'status'           => 'completed',
            'ai_summary'       => 'Se trabajó el registro de pensamientos automáticos. La paciente completó las tareas asignadas.',
        ]);

        ConsultingSession::create([
            'patient_id'   => $p1->id,
            'user_id'      => $owner->id,
            'scheduled_at' => now()->addDays(7),
            'status'       => 'scheduled',
        ]);

        Note::create([
            'patient_id'            => $p1->id,
            'user_id'               => $owner->id,
            'consulting_session_id' => $s1a->id,
            'content'               => 'Progreso notable en el manejo de las situaciones de estrés. Mantiene el diario de pensamientos.',
            'type'                  => 'session_note',
        ]);

        Note::create([
            'patient_id' => $p1->id,
            'user_id'    => $owner->id,
            'content'    => 'Llamó para comentar que tuvo un momento de ansiedad en el trabajo. Se le recordaron las técnicas de grounding.',
            'type'       => 'quick_note',
        ]);

        Agreement::create([
            'patient_id'            => $p1->id,
            'user_id'               => $owner->id,
            'consulting_session_id' => $s1b->id,
            'content'               => 'Practicar la técnica 5-4-3-2-1 cuando sienta ansiedad en el trabajo.',
            'is_completed'          => true,
            'completed_at'          => now()->subDays(3),
        ]);

        Payment::create([
            'patient_id'     => $p1->id,
            'user_id'        => $owner->id,
            'amount'         => 70.00,
            'concept'        => 'Sesión de psicología #5',
            'payment_method' => 'bizum',
            'status'         => 'paid',
            'due_date'       => now()->subWeeks(2)->toDateString(),
            'paid_at'        => now()->subWeeks(2),
        ]);

        Payment::create([
            'patient_id'     => $p1->id,
            'user_id'        => $owner->id,
            'amount'         => 70.00,
            'concept'        => 'Sesión de psicología #6',
            'payment_method' => 'bizum',
            'status'         => 'paid',
            'due_date'       => now()->subWeek()->toDateString(),
            'paid_at'        => now()->subWeek(),
        ]);

        Appointment::create([
            'clinic_id'       => $clinic->id,
            'patient_id'      => $patientUser1->id,
            'professional_id' => $owner->id,
            'service_id'      => $serviceSession->id,
            'starts_at'       => now()->addDays(7)->setHour(10)->setMinute(0),
            'ends_at'         => now()->addDays(7)->setHour(10)->setMinute(50),
            'status'          => 'confirmed',
            'modality'        => 'video',
        ]);

        // ══════════════════════════════════════════════════
        //  PACIENTE 2 — Marcos Ruiz (cobro pendiente + acuerdo abierto)
        // ══════════════════════════════════════════════════
        $patientUser2 = User::create([
            'name'              => 'Marcos Ruiz',
            'email'             => 'marcos.ruiz@ejemplo.com',
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
            'phone'             => '+34 622 111 222',
        ]);
        $patientUser2->assignRole('patient');

        $p2 = PatientProfile::withoutGlobalScopes()->create([
            'user_id'         => $patientUser2->id,
            'clinic_id'       => $clinic->id,
            'professional_id' => $owner->id,
            'email'           => 'marcos.ruiz@ejemplo.com',
            'phone'           => '+34 622 111 222',
            'is_active'       => true,
            'clinical_notes'  => 'Estrés post-traumático. Episodio de accidente de tráfico hace 8 meses.',
            'diagnosis'       => 'Trastorno de estrés postraumático (F43.1)',
            'treatment_plan'  => 'EMDR. Frecuencia semanal.',
            'status'          => 'active',
            'first_session_at'=> now()->subMonths(3),
            'last_session_at' => now()->subDays(10),
        ]);

        ConsentForm::create([
            'patient_id'       => $p2->id,
            'user_id'          => $owner->id,
            'template_version' => '1.0',
            'content_snapshot' => 'En cumplimiento del RGPD (UE) 2016/679, sus datos serán tratados con la única finalidad de prestar el servicio de psicoterapia.',
            'status'           => 'signed',
            'signed_at'        => now()->subMonths(3),
            'signed_ip'        => '127.0.0.1',
            'expires_at'       => now()->addMonths(9)->toDateString(),
        ]);

        $s2a = ConsultingSession::create([
            'patient_id'       => $p2->id,
            'user_id'          => $owner->id,
            'scheduled_at'     => now()->subDays(10),
            'started_at'       => now()->subDays(10),
            'ended_at'         => now()->subDays(10)->addMinutes(60),
            'duration_minutes' => 60,
            'status'           => 'completed',
        ]);

        ConsultingSession::create([
            'patient_id'   => $p2->id,
            'user_id'      => $owner->id,
            'scheduled_at' => now()->addDays(3),
            'status'       => 'scheduled',
        ]);

        Note::create([
            'patient_id'            => $p2->id,
            'user_id'               => $owner->id,
            'consulting_session_id' => $s2a->id,
            'content'               => 'Primera sesión de EMDR. El paciente toleró bien la estimulación bilateral. Reducción leve de la intensidad del recuerdo traumático.',
            'type'                  => 'session_note',
        ]);

        Agreement::create([
            'patient_id'            => $p2->id,
            'user_id'               => $owner->id,
            'consulting_session_id' => $s2a->id,
            'content'               => 'Escribir en el diario 10 minutos cada noche sobre las emociones del día.',
            'is_completed'          => false,
        ]);

        Payment::create([
            'patient_id' => $p2->id,
            'user_id'    => $owner->id,
            'amount'     => 80.00,
            'concept'    => 'Sesión EMDR #3',
            'status'     => 'pending',
            'due_date'   => now()->subDays(5)->toDateString(),
        ]);

        Appointment::create([
            'clinic_id'       => $clinic->id,
            'patient_id'      => $patientUser2->id,
            'professional_id' => $owner->id,
            'service_id'      => $serviceSession->id,
            'starts_at'       => now()->addDays(3)->setHour(11)->setMinute(0),
            'ends_at'         => now()->addDays(3)->setHour(12)->setMinute(0),
            'status'          => 'confirmed',
            'modality'        => 'in_person',
        ]);

        // ══════════════════════════════════════════════════
        //  PACIENTE 3 — Laura Sánchez (sin consentimiento + cobro vencido)
        // ══════════════════════════════════════════════════
        $patientUser3 = User::create([
            'name'              => 'Laura Sánchez',
            'email'             => 'laura.sanchez@ejemplo.com',
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $patientUser3->assignRole('patient');

        $p3 = PatientProfile::withoutGlobalScopes()->create([
            'user_id'         => $patientUser3->id,
            'clinic_id'       => $clinic->id,
            'professional_id' => $owner->id,
            'email'           => 'laura.sanchez@ejemplo.com',
            'is_active'       => true,
            'clinical_notes'  => 'Duelo por pérdida familiar. Primera consulta hace 2 semanas.',
            'diagnosis'       => 'Reacción de duelo (F43.2)',
            'treatment_plan'  => 'Terapia humanista de duelo.',
            'status'          => 'active',
            'first_session_at'=> now()->subDays(14),
        ]);

        ConsultingSession::create([
            'patient_id'       => $p3->id,
            'user_id'          => $owner->id,
            'scheduled_at'     => now()->subDays(14),
            'started_at'       => now()->subDays(14),
            'ended_at'         => now()->subDays(14)->addMinutes(50),
            'duration_minutes' => 50,
            'status'           => 'completed',
        ]);

        ConsultingSession::create([
            'patient_id'   => $p3->id,
            'user_id'      => $owner->id,
            'scheduled_at' => now()->addDays(10),
            'status'       => 'scheduled',
        ]);

        Note::create([
            'patient_id' => $p3->id,
            'user_id'    => $owner->id,
            'content'    => 'Primera sesión de evaluación. La paciente se muestra con poca energía y cierta resistencia a hablar del fallecimiento. Buen rapport inicial.',
            'type'       => 'session_note',
        ]);

        Payment::create([
            'patient_id' => $p3->id,
            'user_id'    => $owner->id,
            'amount'     => 70.00,
            'concept'    => 'Primera consulta',
            'status'     => 'overdue',
            'due_date'   => now()->subDays(10)->toDateString(),
        ]);

        // ══════════════════════════════════════════════════
        //  PACIENTE 4 — Javier Moreno (alta, todo en regla)
        // ══════════════════════════════════════════════════
        $patientUser4 = User::create([
            'name'              => 'Javier Moreno',
            'email'             => 'javier.moreno@ejemplo.com',
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
            'phone'             => '+34 633 555 444',
        ]);
        $patientUser4->assignRole('patient');

        $p4 = PatientProfile::withoutGlobalScopes()->create([
            'user_id'         => $patientUser4->id,
            'clinic_id'       => $clinic->id,
            'professional_id' => $owner->id,
            'email'           => 'javier.moreno@ejemplo.com',
            'phone'           => '+34 633 555 444',
            'is_active'       => false,
            'clinical_notes'  => 'Fobia social. Alta dada en el mes anterior tras 8 meses de tratamiento exitoso.',
            'diagnosis'       => 'Trastorno de ansiedad social (F40.1)',
            'treatment_plan'  => 'Alta terapéutica. Seguimiento semestral recomendado.',
            'status'          => 'discharged',
            'first_session_at'=> now()->subMonths(8),
            'last_session_at' => now()->subMonth(),
        ]);

        ConsentForm::create([
            'patient_id'       => $p4->id,
            'user_id'          => $owner->id,
            'template_version' => '1.0',
            'content_snapshot' => 'En cumplimiento del RGPD (UE) 2016/679, sus datos serán tratados con la única finalidad de prestar el servicio de psicoterapia.',
            'status'           => 'signed',
            'signed_at'        => now()->subMonths(8),
            'signed_ip'        => '127.0.0.1',
            'expires_at'       => now()->addMonths(4)->toDateString(),
        ]);

        Payment::create([
            'patient_id'     => $p4->id,
            'user_id'        => $owner->id,
            'amount'         => 70.00,
            'concept'        => 'Sesión de cierre',
            'payment_method' => 'transfer',
            'status'         => 'paid',
            'due_date'       => now()->subMonth()->toDateString(),
            'paid_at'        => now()->subMonth(),
        ]);

        $this->command->info('Users seeded successfully (v2).');
        $this->command->info('  admin@clientkosmos.test    / password  [admin]');
        $this->command->info('  natalia@clientkosmos.test  / password  [owner]');
        $this->command->info('  carlos@clientkosmos.test   / password  [professional]');
        $this->command->info('  ana.garcia@ejemplo.com     / password  [patient]');
        $this->command->info('  marcos.ruiz@ejemplo.com    / password  [patient]');
        $this->command->info('  laura.sanchez@ejemplo.com  / password  [patient]');
        $this->command->info('  javier.moreno@ejemplo.com  / password  [patient]');
    }
}
