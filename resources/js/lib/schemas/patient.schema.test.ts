import { describe, expect, it } from 'vitest';
import { patientSchema } from './patient.schema';

describe('patientSchema', () => {
    it('accepts a payload with only the required project_name', () => {
        const result = patientSchema.safeParse({ project_name: 'Ana López' });

        expect(result.success).toBe(true);
    });

    it('rejects an empty project_name', () => {
        const result = patientSchema.safeParse({ project_name: '' });

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path[0] === 'project_name');
            expect(issue?.message).toBe('El nombre del paciente es obligatorio');
        }
    });

    it('rejects a project_name longer than 255 chars', () => {
        const result = patientSchema.safeParse({
            project_name: 'a'.repeat(256),
        });

        expect(result.success).toBe(false);
    });

    it('accepts an empty string for optional email (Zod literal escape hatch)', () => {
        const result = patientSchema.safeParse({
            project_name: 'Ana',
            email: '',
            phone: '',
            brand_tone: '',
            service_scope: '',
            next_deadline: '',
        });

        expect(result.success).toBe(true);
    });

    it('rejects an invalid email when one is provided', () => {
        const result = patientSchema.safeParse({
            project_name: 'Ana',
            email: 'not-an-email',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path[0] === 'email');
            expect(issue?.message).toBe('Introduce un email válido');
        }
    });

    it('rejects a phone longer than 50 chars', () => {
        const result = patientSchema.safeParse({
            project_name: 'Ana',
            phone: '6'.repeat(51),
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path[0] === 'phone');
            expect(issue?.message).toBe('Máximo 50 caracteres');
        }
    });

    it('rejects a brand_tone longer than 150 chars', () => {
        const result = patientSchema.safeParse({
            project_name: 'Ana',
            brand_tone: 'x'.repeat(151),
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path[0] === 'brand_tone');
            expect(issue?.message).toBe('Máximo 150 caracteres');
        }
    });
});
