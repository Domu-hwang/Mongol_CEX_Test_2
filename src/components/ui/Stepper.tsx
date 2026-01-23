import React from 'react';
import { cn } from '@/design-system';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: { label: string; description?: string; id?: string }[];
  currentStep: number;
  className?: string;
  showLabels?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className,
  showLabels = true
}) => {
  return (
    <nav className={cn('w-full', className)} aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <li key={step.label} className="flex-1 relative">
              <div className="flex flex-col items-center">
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
                  <div className="mt-2 text-center">
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isCompleted && 'text-yellow-500',
                        isCurrent && 'text-foreground',
                        isFuture && 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 transition-colors duration-200',
                    isCompleted ? 'bg-yellow-500' : 'bg-border'
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

export default Stepper;
