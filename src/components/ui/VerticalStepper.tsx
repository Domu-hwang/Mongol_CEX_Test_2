import React from 'react';
import { cn } from '@/design-system';
import { Check } from 'lucide-react';

interface VerticalStepperProps {
    steps: { label: string; description?: string; id?: string }[];
    currentStep: number;
    onStepChange?: (step: number) => void;
    className?: string;
    showLabels?: boolean;
    orientation?: 'vertical'; // Explicitly define orientation as vertical
}

export const VerticalStepper: React.FC<VerticalStepperProps> = ({
    steps,
    currentStep,
    onStepChange,
    className,
    showLabels = true
}) => {
    return (
        <nav className={cn('h-full', className)} aria-label="Progress">
            <ol className="flex flex-col space-y-4 h-full">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isFuture = index > currentStep;

                    return (
                        <li
                            key={step.label}
                            className="relative flex items-start flex-1"
                        >
                            <button
                                onClick={() => onStepChange && onStepChange(index)}
                                className="flex flex-row items-center focus:outline-none"
                            >
                                {/* Step Circle */}
                                <div
                                    className={cn(
                                        'flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all duration-200',
                                        isCompleted && 'bg-yellow-500 text-black',
                                        isCurrent && 'border-2 border-yellow-500 text-yellow-500 bg-yellow-500/10',
                                        isFuture && 'border-2 border-border text-muted-foreground bg-background'
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>

                                {/* Step Label */}
                                {showLabels && (
                                    <div className="ml-3 mt-0 text-left">
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                isCompleted && 'text-yellow-500',
                                                isCurrent && 'text-foreground',
                                                isFuture && 'text-muted-foreground'
                                            )}
                                        >
                                            {step.label}
                                        </span>
                                        {step.description && (
                                            <p className="text-xs text-muted-foreground">{step.description}</p>
                                        )}
                                    </div>
                                )}
                            </button>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'absolute bg-border transition-colors duration-200',
                                        'left-5 top-10 w-0.5 h-full',
                                        isCompleted && 'bg-yellow-500'
                                    )}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default VerticalStepper;