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
    const inputStateClass = error ? 'border-rose-500 focus-visible:ring-rose-500' : 'border-slate-300 focus-visible:ring-blue-500';

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            <input
                className={`touch-target w-full rounded-lg border bg-white px-4 py-2 text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${inputStateClass} ${className}`}
                {...props}
            />

            {(helperText || error) && (
                <p className={`text-sm ${error ? 'text-rose-600' : 'text-slate-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};
