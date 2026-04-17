import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Rule {
    label: string;
    test: (password: string) => boolean;
}

const rules: Rule[] = [
    { label: 'Al menos 8 caracteres', test: (p) => p.length >= 8 },
    { label: 'Una letra mayúscula', test: (p) => /[A-Z]/.test(p) },
    { label: 'Una letra minúscula', test: (p) => /[a-z]/.test(p) },
    { label: 'Un número', test: (p) => /[0-9]/.test(p) },
    { label: 'Un símbolo (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string): number {
    if (!password) return 0;
    return rules.filter((r) => r.test(password)).length;
}

const strengthConfig = [
    { label: '', color: 'bg-muted' },
    { label: 'Muy débil', color: 'bg-destructive' },
    { label: 'Débil', color: 'bg-orange-500' },
    { label: 'Regular', color: 'bg-yellow-500' },
    { label: 'Fuerte', color: 'bg-blue-500' },
    { label: 'Muy fuerte', color: 'bg-green-500' },
];

interface PasswordStrengthProps {
    password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) return null;

    const strength = getStrength(password);
    const config = strengthConfig[strength];

    return (
        <div className="mt-2 space-y-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={cn(
                            'h-1.5 flex-1 rounded-full transition-all duration-300',
                            strength >= level ? config.color : 'bg-muted',
                        )}
                    />
                ))}
            </div>

            {config.label && (
                <p className={cn('text-xs font-medium', strength <= 2 ? 'text-destructive' : strength <= 3 ? 'text-yellow-600' : 'text-green-600')}>
                    {config.label}
                </p>
            )}

            <ul className="space-y-1">
                {rules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                        <li key={rule.label} className={cn('flex items-center gap-1.5 text-xs', passed ? 'text-green-600' : 'text-muted-foreground')}>
                            {passed ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
                            {rule.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
