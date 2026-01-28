import React from 'react';
import { cn } from '@/design-system';
import { Check } from 'lucide-react';

interface VerticalStepperProps {
    steps: { label: string; description?: string; id?: string; inactive?: boolean }[]; // Added inactive property
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
            <ol className="flex flex-col">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isLast = index === steps.length - 1;

                    // Determine circle background and text color
                    let circleClasses = 'border-2 border-border text-muted-foreground bg-background';
                    let labelClasses = 'text-muted-foreground';

                    if (isCompleted) {
                        circleClasses = 'bg-yellow-500 text-black';
                        labelClasses = 'text-yellow-500';
                    } else if (isCurrent && !step.inactive) {
                        circleClasses = 'border-2 border-yellow-500 text-yellow-500 bg-yellow-500/10';
                        labelClasses = 'text-foreground';
                    } else if (isCurrent && step.inactive) {
                        circleClasses = 'border-2 border-border text-muted-foreground bg-background';
                        labelClasses = 'text-muted-foreground';
                    }

                    return (
                        <li
                            key={step.label}
                            className={cn(
                                'relative flex items-start',
                                !isLast && 'min-h-[72px]'
                            )}
                        >
                            {/* Connector Line - connecting between circles */}
                            {!isLast && (
                                <div
                                    className={cn(
                                        'absolute left-[19px] top-10 bottom-0 w-0.5 bg-border transition-colors duration-200',
                                        isCompleted && 'bg-yellow-500'
                                    )}
                                />
                            )}

                            <button
                                onClick={() => onStepChange && onStepChange(index)}
                                className="flex flex-row items-center focus:outline-none relative z-10"
                            >
                                {/* Step Circle */}
                                <div
                                    className={cn(
                                        'flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all duration-200',
                                        circleClasses
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
                                                labelClasses
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
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default VerticalStepper;