import type { z } from 'zod';

/**
 * Runs a Zod schema against `data`. If validation passes, returns true.
 * If validation fails, maps the first error per field path to `onError`
 * (compatible with Inertia useForm `setError`) and returns false.
 */
export function validateOrSetErrors<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    onError: (errors: Record<string, string>) => unknown,
): data is T {
    const result = schema.safeParse(data);
    if (result.success) return true;

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
        const key = issue.path.join('.');
        if (key && !errors[key]) {
            errors[key] = issue.message;
        }
    }
    onError(errors);
    return false;
}
