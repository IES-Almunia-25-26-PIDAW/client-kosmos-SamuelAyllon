<?php

namespace Database\Seeders;

use App\Models\Agreement;
use App\Models\Appointment;
use App\Models\Workspace;
use App\Models\ConsentForm;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Note;
use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\Service;
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
            'name' => 'Admin ClientKosmos',
            'email' => 'admin@clientkosmos.test',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // ══════════════════════════════════════════════════
        //  OWNER / PROFESSIONAL — Natalia Ayllón
        //  Clínica con local físico (in_person + video_call)
        // ══════════════════════════════════════════════════
        $owner = User::create([
            'name' => 'Natalia Ayllón',
            'email' => 'natalia@clientkosmos.test',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'tutorial_completed_at' => now(),
            'phone' => '+34 600 000 001',
        ]);
        $owner->assignRole('professional');

        $workspace = Workspace::create([
            'creator_id' => $owner->id,
            'name' => 'Consulta Natalia Ayllón',
            'slug' => 'consulta-natalia-ayllon',
            'tax_name' => 'Natalia Ayllón López',
            'tax_id' => '12345678Z',
            'tax_address' => 'Calle Mayor 10, 2ºA, 08001 Barcelona',
            'location_address' => 'Calle Mayor 10, 2ºA, 08001 Barcelona',
            'phone' => '+34 600 000 001',
            'email' => 'natalia@clientkosmos.test',
        ]);

        $workspace->members()->attach($owner->id, [
            'role' => 'billing_manager',
            'joined_at' => now(),
            'is_active' => true,
        ]);

        $serviceSession = Service::create([
            'workspace_id' => $workspace->id,
            'name' => 'Sesión de psicología',
            'description' => 'Sesión individual de psicoterapia (50 min)',
            'duration_minutes' => 50,
            'price' => 70.00,
            'color' => '#6366f1',
            'is_active' => true,
        ]);

        Service::create([
            'workspace_id' => $workspace->id,
            'name' => 'Sesión EMDR',
            'description' => 'Sesión especializada EMDR (60 min)',
            'duration_minutes' => 60,
            'price' => 80.00,
            'color' => '#8b5cf6',
            'is_active' => true,
        ]);

        // ══════════════════════════════════════════════════
        //  PROFESSIONAL ADICIONAL — Carlos Vega
        // ══════════════════════════════════════════════════
        $pro2 = User::create([
            'name' => 'Carlos Vega',
            'email' => 'carlos@clientkosmos.test',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'tutorial_completed_at' => now(),
            'phone' => '+34 600 000 002',
        ]);
        $pro2->assignRole('professional');

        $workspace->members()->attach($pro2->id, [
            'role' => 'member',
            'joined_at' => now()->subMonths(2),
            'is_active' => true,
        ]);

        // ══════════════════════════════════════════════════
        //  PACIENTE 1 — Ana García (compartida: Natalia primary, Carlos secondary)
        // ══════════════════════════════════════════════════
        $patientUser1 = User::create([
            'name' => 'Ana García',
            'email' => 'ana.garcia@ejemplo.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone' => '+34 612 345 678',
        ]);
        $patientUser1->assignRole('patient');

        $p1 = PatientProfile::withoutGlobalScopes()->create([
            'user_id' => $patientUser1->id,
            'workspace_id' => $workspace->id,
            'professional_id' => $owner->id,
            'is_active' => true,
            'clinical_notes' => 'Trastorno de ansiedad generalizada. Lleva 6 meses en tratamiento con evolución positiva.',
            'diagnosis' => 'Trastorno de ansiedad generalizada (F41.1)',
            'treatment_plan' => 'TCC con técnicas de regulación emocional. Frecuencia quincenal.',
            'status' => 'active',
            'first_session_at' => now()->subMonths(6),
            'last_session_at' => now()->subWeek(),
        ]);

        // Pivot case_assignments — Natalia primary
        CaseAssignment::create([
            'patient_id' => $patientUser1->id,
            'professional_id' => $owner->id,
            'workspace_id' => $workspace->id,
            'is_primary' => true,
            'status' => 'active',
            'started_at' => now()->subMonths(6)->toDateString(),
        ]);

        // Pivot case_assignments — Carlos secondary (ejercita can_view_all_patients)
        CaseAssignment::create([
            'patient_id' => $patientUser1->id,
            'professional_id' => $pro2->id,
            'workspace_id' => $workspace->id,
            'is_primary' => false,
            'status' => 'active',
            'started_at' => now()->subMonth()->toDateString(),
        ]);

        ConsentForm::create([
            'patient_id' => $p1->id,
            'user_id' => $owner->id,
            'template_version' => '1.0',
            'content_snapshot' => 'En cumplimiento del RGPD (UE) 2016/679, sus datos serán tratados con la única finalidad de prestar el servicio de psicoterapia.',
            'status' => 'signed',
            'signed_at' => now()->subMonths(5),
            'signed_ip' => '127.0.0.1',
            'expires_at' => now()->addMonths(7)->toDateString(),
        ]);

        $a1a = Appointment::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser1->id,
            'professional_id' => $owner->id,
            'service_id' => $serviceSession->id,
            'starts_at' => now()->subWeeks(2)->setHour(10)->setMinute(0),
            'ends_at' => now()->subWeeks(2)->setHour(10)->setMinute(50),
            'status' => 'completed',
            'modality' => 'video_call',
        ]);

        $a1b = Appointment::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser1->id,
            'professional_id' => $owner->id,
            'service_id' => $serviceSession->id,
            'starts_at' => now()->subWeek()->setHour(10)->setMinute(0),
            'ends_at' => now()->subWeek()->setHour(10)->setMinute(50),
            'status' => 'completed',
            'modality' => 'video_call',
        ]);

        Appointment::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser1->id,
            'professional_id' => $owner->id,
            'service_id' => $serviceSession->id,
            'starts_at' => now()->addDays(7)->setHour(10)->setMinute(0),
            'ends_at' => now()->addDays(7)->setHour(10)->setMinute(50),
            'status' => 'confirmed',
            'modality' => 'video_call',
        ]);

        Note::create([
            'patient_id' => $p1->id,
            'user_id' => $owner->id,
            'appointment_id' => $a1a->id,
            'content' => 'Progreso notable en el manejo de las situaciones de estrés. Mantiene el diario de pensamientos.',
            'type' => 'session_note',
        ]);

        Note::create([
            'patient_id' => $p1->id,
            'user_id' => $owner->id,
            'content' => 'Llamó para comentar que tuvo un momento de ansiedad en el trabajo. Se le recordaron las técnicas de grounding.',
            'type' => 'quick_note',
        ]);

        Agreement::create([
            'patient_id' => $p1->id,
            'user_id' => $owner->id,
            'appointment_id' => $a1b->id,
            'content' => 'Practicar la técnica 5-4-3-2-1 cuando sienta ansiedad en el trabajo.',
            'is_completed' => true,
            'completed_at' => now()->subDays(3),
        ]);

        $inv1a = Invoice::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser1->id,
            'professional_id' => $owner->id,
            'invoice_number' => 'FAC-2026-001',
            'status' => 'paid',
            'subtotal' => 70.00,
            'tax_rate' => 0,
            'tax_amount' => 0,
            'total' => 70.00,
            'payment_method' => 'bizum',
            'due_at' => now()->subWeeks(2)->toDateString(),
            'paid_at' => now()->subWeeks(2),
        ]);
        InvoiceItem::create(['invoice_id' => $inv1a->id, 'description' => 'Sesión de psicología #5', 'quantity' => 1, 'unit_price' => 70.00, 'total' => 70.00, 'appointment_id' => $a1a->id]);

        $inv1b = Invoice::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser1->id,
            'professional_id' => $owner->id,
            'invoice_number' => 'FAC-2026-002',
            'status' => 'paid',
            'subtotal' => 70.00,
            'tax_rate' => 0,
            'tax_amount' => 0,
            'total' => 70.00,
            'payment_method' => 'bizum',
            'due_at' => now()->subWeek()->toDateString(),
            'paid_at' => now()->subWeek(),
        ]);
        InvoiceItem::create(['invoice_id' => $inv1b->id, 'description' => 'Sesión de psicología #6', 'quantity' => 1, 'unit_price' => 70.00, 'total' => 70.00, 'appointment_id' => $a1b->id]);

        // ══════════════════════════════════════════════════
        //  PACIENTE 2 — Marcos Ruiz (cobro pendiente + acuerdo abierto)
        // ══════════════════════════════════════════════════
        $patientUser2 = User::create([
            'name' => 'Marcos Ruiz',
            'email' => 'marcos.ruiz@ejemplo.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone' => '+34 622 111 222',
        ]);
        $patientUser2->assignRole('patient');

        $p2 = PatientProfile::withoutGlobalScopes()->create([
            'user_id' => $patientUser2->id,
            'workspace_id' => $workspace->id,
            'professional_id' => $owner->id,
            'is_active' => true,
            'clinical_notes' => 'Estrés post-traumático. Episodio de accidente de tráfico hace 8 meses.',
            'diagnosis' => 'Trastorno de estrés postraumático (F43.1)',
            'treatment_plan' => 'EMDR. Frecuencia semanal.',
            'status' => 'active',
            'first_session_at' => now()->subMonths(3),
            'last_session_at' => now()->subDays(10),
        ]);

        CaseAssignment::create([
            'patient_id' => $patientUser2->id,
            'professional_id' => $owner->id,
            'workspace_id' => $workspace->id,
            'is_primary' => true,
            'status' => 'active',
            'started_at' => now()->subMonths(3)->toDateString(),
        ]);

        ConsentForm::create([
            'patient_id' => $p2->id,
            'user_id' => $owner->id,
            'template_version' => '1.0',
            'content_snapshot' => 'En cumplimiento del RGPD (UE) 2016/679, sus datos serán tratados con la única finalidad de prestar el servicio de psicoterapia.',
            'status' => 'signed',
            'signed_at' => now()->subMonths(3),
            'signed_ip' => '127.0.0.1',
            'expires_at' => now()->addMonths(9)->toDateString(),
        ]);

        $a2a = Appointment::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser2->id,
            'professional_id' => $owner->id,
            'service_id' => $serviceSession->id,
            'starts_at' => now()->subDays(10)->setHour(11)->setMinute(0),
            'ends_at' => now()->subDays(10)->setHour(12)->setMinute(0),
            'status' => 'completed',
            'modality' => 'in_person',
        ]);

        Appointment::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser2->id,
            'professional_id' => $owner->id,
            'service_id' => $serviceSession->id,
            'starts_at' => now()->addDays(3)->setHour(11)->setMinute(0),
            'ends_at' => now()->addDays(3)->setHour(12)->setMinute(0),
            'status' => 'confirmed',
            'modality' => 'in_person',
        ]);

        Note::create([
            'patient_id' => $p2->id,
            'user_id' => $owner->id,
            'appointment_id' => $a2a->id,
            'content' => 'Primera sesión de EMDR. El paciente toleró bien la estimulación bilateral. Reducción leve de la intensidad del recuerdo traumático.',
            'type' => 'session_note',
        ]);

        Agreement::create([
            'patient_id' => $p2->id,
            'user_id' => $owner->id,
            'appointment_id' => $a2a->id,
            'content' => 'Escribir en el diario 10 minutos cada noche sobre las emociones del día.',
            'is_completed' => false,
        ]);

        $inv2 = Invoice::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser2->id,
            'professional_id' => $owner->id,
            'invoice_number' => 'FAC-2026-003',
            'status' => 'overdue',
            'subtotal' => 80.00,
            'tax_rate' => 0,
            'tax_amount' => 0,
            'total' => 80.00,
            'due_at' => now()->subDays(5)->toDateString(),
        ]);
        InvoiceItem::create(['invoice_id' => $inv2->id, 'description' => 'Sesión EMDR #3', 'quantity' => 1, 'unit_price' => 80.00, 'total' => 80.00, 'appointment_id' => $a2a->id]);

        // ══════════════════════════════════════════════════
        //  PACIENTE 3 — Laura Sánchez (sin consentimiento + cobro vencido)
        // ══════════════════════════════════════════════════
        $patientUser3 = User::create([
            'name' => 'Laura Sánchez',
            'email' => 'laura.sanchez@ejemplo.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $patientUser3->assignRole('patient');

        $p3 = PatientProfile::withoutGlobalScopes()->create([
            'user_id' => $patientUser3->id,
            'workspace_id' => $workspace->id,
            'professional_id' => $owner->id,
            'is_active' => true,
            'clinical_notes' => 'Duelo por pérdida familiar. Primera consulta hace 2 semanas.',
            'diagnosis' => 'Reacción de duelo (F43.2)',
            'treatment_plan' => 'Terapia humanista de duelo.',
            'status' => 'active',
            'first_session_at' => now()->subDays(14),
        ]);

        CaseAssignment::create([
            'patient_id' => $patientUser3->id,
            'professional_id' => $owner->id,
            'workspace_id' => $workspace->id,
            'is_primary' => true,
            'status' => 'active',
            'started_at' => now()->subDays(14)->toDateString(),
        ]);

        $a3a = Appointment::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser3->id,
            'professional_id' => $owner->id,
            'service_id' => $serviceSession->id,
            'starts_at' => now()->subDays(14)->setHour(10)->setMinute(0),
            'ends_at' => now()->subDays(14)->setHour(10)->setMinute(50),
            'status' => 'completed',
            'modality' => 'in_person',
        ]);

        Appointment::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser3->id,
            'professional_id' => $owner->id,
            'service_id' => $serviceSession->id,
            'starts_at' => now()->addDays(10)->setHour(10)->setMinute(0),
            'ends_at' => now()->addDays(10)->setHour(10)->setMinute(50),
            'status' => 'confirmed',
            'modality' => 'in_person',
        ]);

        Note::create([
            'patient_id' => $p3->id,
            'user_id' => $owner->id,
            'appointment_id' => $a3a->id,
            'content' => 'Primera sesión de evaluación. La paciente se muestra con poca energía y cierta resistencia a hablar del fallecimiento. Buen rapport inicial.',
            'type' => 'session_note',
        ]);

        $inv3 = Invoice::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser3->id,
            'professional_id' => $owner->id,
            'invoice_number' => 'FAC-2026-004',
            'status' => 'overdue',
            'subtotal' => 70.00,
            'tax_rate' => 0,
            'tax_amount' => 0,
            'total' => 70.00,
            'due_at' => now()->subDays(10)->toDateString(),
        ]);
        InvoiceItem::create(['invoice_id' => $inv3->id, 'description' => 'Primera consulta', 'quantity' => 1, 'unit_price' => 70.00, 'total' => 70.00, 'appointment_id' => $a3a->id]);

        // ══════════════════════════════════════════════════
        //  PACIENTE 4 — Javier Moreno (alta, todo en regla)
        // ══════════════════════════════════════════════════
        $patientUser4 = User::create([
            'name' => 'Javier Moreno',
            'email' => 'javier.moreno@ejemplo.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone' => '+34 633 555 444',
        ]);
        $patientUser4->assignRole('patient');

        $p4 = PatientProfile::withoutGlobalScopes()->create([
            'user_id' => $patientUser4->id,
            'workspace_id' => $workspace->id,
            'professional_id' => $owner->id,
            'is_active' => false,
            'clinical_notes' => 'Fobia social. Alta dada en el mes anterior tras 8 meses de tratamiento exitoso.',
            'diagnosis' => 'Trastorno de ansiedad social (F40.1)',
            'treatment_plan' => 'Alta terapéutica. Seguimiento semestral recomendado.',
            'status' => 'discharged',
            'first_session_at' => now()->subMonths(8),
            'last_session_at' => now()->subMonth(),
        ]);

        CaseAssignment::create([
            'patient_id' => $patientUser4->id,
            'professional_id' => $owner->id,
            'workspace_id' => $workspace->id,
            'is_primary' => true,
            'status' => 'ended',
            'started_at' => now()->subMonths(8)->toDateString(),
            'ended_at' => now()->subMonth()->toDateString(),
        ]);

        ConsentForm::create([
            'patient_id' => $p4->id,
            'user_id' => $owner->id,
            'template_version' => '1.0',
            'content_snapshot' => 'En cumplimiento del RGPD (UE) 2016/679, sus datos serán tratados con la única finalidad de prestar el servicio de psicoterapia.',
            'status' => 'signed',
            'signed_at' => now()->subMonths(8),
            'signed_ip' => '127.0.0.1',
            'expires_at' => now()->addMonths(4)->toDateString(),
        ]);

        $inv4 = Invoice::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patientUser4->id,
            'professional_id' => $owner->id,
            'invoice_number' => 'FAC-2026-005',
            'status' => 'paid',
            'subtotal' => 70.00,
            'tax_rate' => 0,
            'tax_amount' => 0,
            'total' => 70.00,
            'payment_method' => 'transfer',
            'due_at' => now()->subMonth()->toDateString(),
            'paid_at' => now()->subMonth(),
        ]);
        InvoiceItem::create(['invoice_id' => $inv4->id, 'description' => 'Sesión de cierre', 'quantity' => 1, 'unit_price' => 70.00, 'total' => 70.00]);

        // ══════════════════════════════════════════════════
        //  PRÁCTICA ONLINE-ONLY — Elena Martínez
        //  Sin local físico → solo video_call
        // ══════════════════════════════════════════════════
        $elenaOwner = User::create([
            'name' => 'Elena Martínez',
            'email' => 'elena@clientkosmos.test',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'tutorial_completed_at' => now(),
            'phone' => '+34 611 222 333',
        ]);
        $elenaOwner->assignRole('professional');

        // location_address null → isOnlineOnly() === true
        $elenaClinic = Workspace::create([
            'creator_id' => $elenaOwner->id,
            'name' => 'Psicología Online Elena Martínez',
            'slug' => 'psicologia-online-elena-martinez',
            'tax_name' => 'Elena Martínez Ruiz',
            'tax_id' => '87654321X',
            'phone' => '+34 611 222 333',
            'email' => 'elena@clientkosmos.test',
            'location_address' => null,
        ]);

        $elenaClinic->members()->attach($elenaOwner->id, [
            'role' => 'billing_manager',
            'joined_at' => now(),
            'is_active' => true,
        ]);

        $elenaService = Service::create([
            'workspace_id' => $elenaClinic->id,
            'name' => 'Sesión online',
            'description' => 'Sesión individual por videollamada (50 min)',
            'duration_minutes' => 50,
            'price' => 65.00,
            'color' => '#10b981',
            'is_active' => true,
        ]);

        $patientUserElena = User::create([
            'name' => 'Sofía Torres',
            'email' => 'sofia.torres@ejemplo.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'phone' => '+34 644 777 888',
        ]);
        $patientUserElena->assignRole('patient');

        $pElena = PatientProfile::withoutGlobalScopes()->create([
            'user_id' => $patientUserElena->id,
            'workspace_id' => $elenaClinic->id,
            'professional_id' => $elenaOwner->id,
            'is_active' => true,
            'clinical_notes' => 'Problemas de autoestima y gestión emocional. Modalidad exclusivamente online.',
            'diagnosis' => 'Baja autoestima (Z73.1)',
            'treatment_plan' => 'Terapia cognitivo-conductual online. Frecuencia semanal.',
            'status' => 'active',
            'first_session_at' => now()->subMonths(2),
            'last_session_at' => now()->subDays(7),
        ]);

        CaseAssignment::create([
            'patient_id' => $patientUserElena->id,
            'professional_id' => $elenaOwner->id,
            'workspace_id' => $elenaClinic->id,
            'is_primary' => true,
            'status' => 'active',
            'started_at' => now()->subMonths(2)->toDateString(),
        ]);

        $ae1 = Appointment::create([
            'workspace_id' => $elenaClinic->id,
            'patient_id' => $patientUserElena->id,
            'professional_id' => $elenaOwner->id,
            'service_id' => $elenaService->id,
            'starts_at' => now()->subDays(7)->setHour(17)->setMinute(0),
            'ends_at' => now()->subDays(7)->setHour(17)->setMinute(50),
            'status' => 'completed',
            'modality' => 'video_call',
        ]);

        Appointment::create([
            'workspace_id' => $elenaClinic->id,
            'patient_id' => $patientUserElena->id,
            'professional_id' => $elenaOwner->id,
            'service_id' => $elenaService->id,
            'starts_at' => now()->addDays(7)->setHour(17)->setMinute(0),
            'ends_at' => now()->addDays(7)->setHour(17)->setMinute(50),
            'status' => 'confirmed',
            'modality' => 'video_call',
        ]);

        Note::create([
            'patient_id' => $pElena->id,
            'user_id' => $elenaOwner->id,
            'appointment_id' => $ae1->id,
            'content' => 'Avance significativo en la identificación de distorsiones cognitivas. Tarea: registro de pensamientos automáticos.',
            'type' => 'session_note',
        ]);

        $this->command->info('Users seeded successfully (v2).');
        $this->command->info('  admin@clientkosmos.test      / password  [admin]');
        $this->command->info('  natalia@clientkosmos.test    / password  [professional]  — workspace con local');
        $this->command->info('  carlos@clientkosmos.test     / password  [professional]');
        $this->command->info('  elena@clientkosmos.test      / password  [professional]  — práctica online-only');
        $this->command->info('  ana.garcia@ejemplo.com       / password  [patient — compartida: Natalia+Carlos]');
        $this->command->info('  marcos.ruiz@ejemplo.com      / password  [patient]');
        $this->command->info('  laura.sanchez@ejemplo.com    / password  [patient]');
        $this->command->info('  javier.moreno@ejemplo.com    / password  [patient — alta]');
        $this->command->info('  sofia.torres@ejemplo.com     / password  [patient — Elena clinic]');
    }
}
