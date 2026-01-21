import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    helperText,
    error,
    className = '',
    ...props
}) => {
    const inputStateClass = error ? 'border-danger-600 focus-visible:ring-danger-600' : 'border-gray-800 focus-visible:ring-primary-600';

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-gray-400">
                    {label}
                </label>
            )}

            <input
                className={`touch-target w-full rounded-lg border bg-[#1e2329] px-4 py-2 text-[#eaecef] transition placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-1 ${inputStateClass} ${className}`}
                {...props}
            />

            {(helperText || error) && (
                <p className={`text-xs ${error ? 'text-danger-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};
