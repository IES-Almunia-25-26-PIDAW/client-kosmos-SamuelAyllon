<?php

namespace Tests\Feature\Security;

use App\Models\Invoice;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class PolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function test_patient_cannot_list_invoices(): void
    {
        $patient = User::factory()->create();
        $patient->assignRole('patient');

        $this->assertFalse($patient->can('viewAny', Invoice::class));
    }

    public function test_professional_can_list_invoices(): void
    {
        $professional = User::factory()->create();
        $professional->assignRole('professional');

        $this->assertTrue($professional->can('viewAny', Invoice::class));
    }

    public function test_admin_can_list_invoices(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->assertTrue($admin->can('viewAny', Invoice::class));
    }

    public function test_patient_cannot_create_invoice(): void
    {
        $patient = User::factory()->create();
        $patient->assignRole('patient');

        $this->assertFalse($patient->can('create', Invoice::class));
    }

    public function test_professional_can_create_invoice(): void
    {
        $professional = User::factory()->create();
        $professional->assignRole('professional');

        $this->assertTrue($professional->can('create', Invoice::class));
    }
}
