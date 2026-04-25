<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Admin
            'panel.admin',
            'users.impersonate',

            // Workspace — gestión funcional
            'workspace.manage',
            'workspace.billing.manage',
            'workspace.team.invite',
            'workspace.team.manage',
            'workspace.metrics.view',

            // Collaboration — acuerdos y derivaciones entre profesionales autónomos
            'collaboration.manage',
            'referrals.send',
            'referrals.respond',

            // Professional — gestión clínica diaria
            'patients.create',
            'patients.read',
            'patients.update',
            'patients.delete',
            'appointments.create',
            'appointments.read',
            'appointments.update',
            'appointments.delete',
            'invoices.create',
            'invoices.read',
            'invoices.update',
            'invoices.delete',
            'video.manage',
            'video.join',
            'transcriptions.read',
            'kosmo.use',
            'messages.send',
            'messages.read',

            // Patient — portal propio
            'appointments.book',
            'invoices.own.read',
            'consents.sign',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $admin = Role::findByName('admin');
        $admin->syncPermissions([
            'panel.admin',
            'users.impersonate',
        ]);

        $professional = Role::findByName('professional');
        $professional->syncPermissions([
            'workspace.manage',
            'workspace.billing.manage',
            'workspace.team.invite',
            'workspace.team.manage',
            'workspace.metrics.view',
            'collaboration.manage',
            'referrals.send',
            'referrals.respond',
            'patients.create',
            'patients.read',
            'patients.update',
            'patients.delete',
            'appointments.create',
            'appointments.read',
            'appointments.update',
            'appointments.delete',
            'invoices.create',
            'invoices.read',
            'invoices.update',
            'invoices.delete',
            'video.manage',
            'video.join',
            'transcriptions.read',
            'kosmo.use',
            'messages.send',
            'messages.read',
        ]);

        $patient = Role::findByName('patient');
        $patient->syncPermissions([
            'appointments.book',
            'invoices.own.read',
            'consents.sign',
            'messages.send',
            'messages.read',
            'video.join',
        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
