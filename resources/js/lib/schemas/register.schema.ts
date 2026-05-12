import { z } from 'zod';

export const registerSchema = z
    .object({
        type: z.enum(['professional', 'patient']),
        name: z.string().min(1, 'El nombre es obligatorio'),
        email: z.string().email('Introduce un email válido'),
        password: z
            .string()
            .min(8, 'Al menos 8 caracteres')
            .regex(/[A-Z]/, 'Debe contener una letra mayúscula')
            .regex(/[a-z]/, 'Debe contener una letra minúscula')
            .regex(/[0-9]/, 'Debe contener un número')
            .regex(/[^A-Za-z0-9]/, 'Debe contener un símbolo (!@#$...)'),
        password_confirmation: z.string().min(1, 'Confirma tu contraseña'),
        phone: z.string().max(50, 'Máximo 50 caracteres').optional().or(z.literal('')),
        license_number: z.string().max(100).optional().or(z.literal('')),
        collegiate_number: z.string().max(100).optional().or(z.literal('')),
        specialties: z.array(z.string()).optional(),
        bio: z.string().optional().or(z.literal('')),
        date_of_birth: z.string().optional().or(z.literal('')),
        consent_privacy_policy: z.boolean(),
        consent_terms_of_service: z.boolean(),
        consent_health_data: z.boolean(),
        consent_recording_global: z.boolean(),
    })
    .refine((d) => d.password === d.password_confirmation, {
        message: 'Las contraseñas no coinciden',
        path: ['password_confirmation'],
    })
    .superRefine((d, ctx) => {
        if (d.type !== 'patient') return;
        if (!d.consent_privacy_policy) {
            ctx.addIssue({ code: 'custom', message: 'Debes aceptar la política de privacidad', path: ['consent_privacy_policy'] });
        }
        if (!d.consent_terms_of_service) {
            ctx.addIssue({ code: 'custom', message: 'Debes aceptar los términos del servicio', path: ['consent_terms_of_service'] });
        }
        if (!d.consent_health_data) {
            ctx.addIssue({ code: 'custom', message: 'Debes aceptar el tratamiento de datos de salud', path: ['consent_health_data'] });
        }
        if (!d.consent_recording_global) {
            ctx.addIssue({ code: 'custom', message: 'Debes autorizar la grabación de sesiones', path: ['consent_recording_global'] });
        }
    });

export type RegisterData = z.infer<typeof registerSchema>;
