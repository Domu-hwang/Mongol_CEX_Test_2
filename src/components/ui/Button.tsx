import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        isLoading = false,
        className = '',
        children,
        ...props
    }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors touch-target rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
            secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 active:bg-slate-400',
            success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
            danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800',
            outline: 'border-2 border-slate-200 text-slate-900 hover:bg-slate-50 active:bg-slate-100',
        };

        const sizes = {
            sm: 'px-3 text-sm',
            md: 'px-4 text-base',
            lg: 'px-6 text-lg',
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={props.disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        처리중...
                    </span>
                ) : (
                    children
                )}
            </button>
        );
    }
);
