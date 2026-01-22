import React from 'react';
import { cn, inputStyles } from '@/design-system';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  suffix?: string;
  inputSize?: 'default' | 'sm' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      description,
      suffix,
      inputSize = 'default',
      className,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(inputStyles.label, 'mb-1.5 block')}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            name={name}
            className={cn(
              inputStyles.base,
              inputStyles.variants.size[inputSize],
              error && inputStyles.variants.state.error,
              suffix && 'pr-10',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? `${inputId}-error` : description ? `${inputId}-description` : undefined
            }
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-muted-foreground text-sm">
              {suffix}
            </span>
          )}
        </div>
        {description && !error && (
          <p id={`${inputId}-description`} className={cn(inputStyles.description, 'mt-1.5')}>
            {description}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className={cn(inputStyles.errorMessage, 'mt-1.5')}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export default Input;
