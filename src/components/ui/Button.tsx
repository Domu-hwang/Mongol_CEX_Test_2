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
            primary: 'bg-primary-600 text-[#181a20] hover:bg-primary-700 active:bg-primary-700',
            secondary: 'bg-secondary-500 text-[#eaecef] hover:bg-[#5e6673] active:bg-secondary-500',
            success: 'bg-success-600 text-[#181a20] hover:bg-success-700 active:bg-success-700 font-bold',
            danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-700 font-bold',
            outline: 'border border-secondary-500 text-[#eaecef] hover:bg-secondary-700 hover:border-primary-600 active:bg-secondary-600',
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
