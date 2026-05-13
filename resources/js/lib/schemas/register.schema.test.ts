import { describe, expect, it } from 'vitest';
import { registerSchema } from './register.schema';

const validProfessional = {
    type: 'professional' as const,
    name: 'Dr. Casas',
    email: 'dr@kosmos.test',
    password: 'Abcdef1!',
    password_confirmation: 'Abcdef1!',
    consent_privacy_policy: false,
    consent_terms_of_service: false,
    consent_health_data: false,
    consent_recording_global: false,
};

const validPatient = {
    ...validProfessional,
    type: 'patient' as const,
    consent_privacy_policy: true,
    consent_terms_of_service: true,
    consent_health_data: true,
    consent_recording_global: true,
};

describe('registerSchema — base rules', () => {
    it('accepts a valid professional payload without requiring health consents', () => {
        const result = registerSchema.safeParse(validProfessional);

        expect(result.success).toBe(true);
    });

    it('rejects when name is empty', () => {
        const result = registerSchema.safeParse({ ...validProfessional, name: '' });

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path[0] === 'name');
            expect(issue?.message).toBe('El nombre es obligatorio');
        }
    });

    it('rejects an invalid email', () => {
        const result = registerSchema.safeParse({ ...validProfessional, email: 'bad' });

        expect(result.success).toBe(false);
    });
});

describe('registerSchema — password complexity', () => {
    it.each([
        ['short', 'Ab1!a'],
        ['no uppercase', 'abcdef1!'],
        ['no lowercase', 'ABCDEF1!'],
        ['no digit', 'Abcdefg!'],
        ['no symbol', 'Abcdefg1'],
    ])('rejects password missing %s', (_label, password) => {
        const result = registerSchema.safeParse({
            ...validProfessional,
            password,
            password_confirmation: password,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const passwordIssues = result.error.issues.filter((i) => i.path[0] === 'password');
            expect(passwordIssues.length).toBeGreaterThan(0);
        }
    });

    it('rejects when password and confirmation do not match', () => {
        const result = registerSchema.safeParse({
            ...validProfessional,
            password: 'Abcdef1!',
            password_confirmation: 'Differ1!',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find(
                (i) => i.path[0] === 'password_confirmation' && i.message === 'Las contraseñas no coinciden',
            );
            expect(issue).toBeDefined();
        }
    });
});

describe('registerSchema — patient RGPD consents (ADR-0027 / ADR-0015)', () => {
    it('accepts a patient with all four consents granted', () => {
        const result = registerSchema.safeParse(validPatient);

        expect(result.success).toBe(true);
    });

    it.each([
        'consent_privacy_policy',
        'consent_terms_of_service',
        'consent_health_data',
        'consent_recording_global',
    ] as const)('rejects a patient missing %s', (consent) => {
        const result = registerSchema.safeParse({
            ...validPatient,
            [consent]: false,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path[0] === consent);
            expect(issue).toBeDefined();
        }
    });

    it('does NOT enforce patient consents on professional registration', () => {
        const result = registerSchema.safeParse({
            ...validProfessional,
            consent_privacy_policy: false,
            consent_terms_of_service: false,
            consent_health_data: false,
            consent_recording_global: false,
        });

        expect(result.success).toBe(true);
    });
});

describe('registerSchema — optional professional fields', () => {
    it('accepts empty strings for optional professional fields', () => {
        const result = registerSchema.safeParse({
            ...validProfessional,
            phone: '',
            license_number: '',
            collegiate_number: '',
            bio: '',
            date_of_birth: '',
        });

        expect(result.success).toBe(true);
    });

    it('rejects a phone longer than 50 chars', () => {
        const result = registerSchema.safeParse({
            ...validProfessional,
            phone: '6'.repeat(51),
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path[0] === 'phone');
            expect(issue?.message).toBe('Máximo 50 caracteres');
        }
    });
});
