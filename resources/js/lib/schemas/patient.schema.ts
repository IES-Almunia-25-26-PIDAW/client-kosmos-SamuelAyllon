import { z } from 'zod';

export const patientSchema = z.object({
    project_name: z.string().min(1, 'El nombre del paciente es obligatorio').max(255),
    email: z
        .string()
        .email('Introduce un email válido')
        .optional()
        .or(z.literal('')),
    phone: z.string().max(50, 'Máximo 50 caracteres').optional().or(z.literal('')),
    brand_tone: z.string().max(150, 'Máximo 150 caracteres').optional().or(z.literal('')),
    service_scope: z.string().optional().or(z.literal('')),
    next_deadline: z.string().optional().or(z.literal('')),
});

export type PatientData = z.infer<typeof patientSchema>;
