import { describe, expect, it } from 'vitest';
import { loginSchema } from './login.schema';

describe('loginSchema', () => {
    it('accepts a valid email and a non-empty password', () => {
        const result = loginSchema.safeParse({
            email: 'pro@kosmos.test',
            password: 'whatever',
        });

        expect(result.success).toBe(true);
    });

    it('rejects an invalid email format', () => {
        const result = loginSchema.safeParse({
            email: 'not-an-email',
            password: 'whatever',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const emailError = result.error.issues.find((i) => i.path[0] === 'email');
            expect(emailError?.message).toBe('Introduce un email válido');
        }
    });

    it('rejects an empty password', () => {
        const result = loginSchema.safeParse({
            email: 'pro@kosmos.test',
            password: '',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const passwordError = result.error.issues.find((i) => i.path[0] === 'password');
            expect(passwordError?.message).toBe('La contraseña es obligatoria');
        }
    });

    it('rejects when both fields are missing', () => {
        const result = loginSchema.safeParse({});

        expect(result.success).toBe(false);
        if (!result.success) {
            const paths = result.error.issues.map((i) => i.path[0]);
            expect(paths).toContain('email');
            expect(paths).toContain('password');
        }
    });
});
