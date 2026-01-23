import React from 'react';
import { cn } from '@/design-system';

interface StepperProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className }) => {
  return (
    <nav className={cn('flex items-center justify-center', className)} aria-label="Progress">
      <ol className="flex items-center space-x-5">
        {steps.map((step, index) => (
          <li key={step.label} className="flex-1">
            {index < currentStep ? (
              // Completed step
              <div className="flex items-center">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary">
                  <svg
                    className="w-5 h-5 text-primary-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {/* Removed step.label */}
              </div>
            ) : index === currentStep ? (
              // Current step
              <div className="flex items-center" aria-current="step">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-primary">
                  <span className="text-primary font-medium">{index + 1}</span>
                </span>
                {/* Removed step.label */}
              </div>
            ) : (
              // Future step
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-border">
                  <span className="text-muted-foreground">{index + 1}</span>
                </div>
                {/* Removed step.label */}
              </div>
            )}
            {index < steps.length - 1 && (
              <div className="flex-auto border-t-2 border-border ml-4 mr-4 hidden md:block" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
