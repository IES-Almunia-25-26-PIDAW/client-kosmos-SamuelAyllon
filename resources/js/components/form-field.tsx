import * as React from 'react';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className = '', label, required, error, description, children, ...props }, ref) => (
    <div ref={ref} className={`space-y-2 ${className}`} {...props}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-foreground)]">
          {label}
          {required && <span className="text-[var(--color-error)] ml-1">*</span>}
        </label>
      )}
      
      <div>
        {children}
      </div>

      {description && !error && (
        <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
      )}

      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  )
);
FormField.displayName = 'FormField';

export { FormField };
