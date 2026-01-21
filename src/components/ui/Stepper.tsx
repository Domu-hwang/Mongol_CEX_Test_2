import React from 'react';
import classNames from 'classnames';

export interface Step {
    id: string;
    label: string;
    description?: string;
}

interface StepperProps {
    steps: Step[];
    currentStepId: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStepId }) => {
    const currentStepIndex = steps.findIndex((s) => s.id === currentStepId);

    return (
        <div className="w-full">
            <ol className="flex items-center w-full">
                {steps.map((step, index) => {
                    const isActive = step.id === currentStepId;
                    const isCompleted = currentStepIndex > index;
                    const isLast = index === steps.length - 1;

                    return (
                        <li key={step.id} className={classNames("flex items-center", isLast ? "" : "w-full")}>
                            <div className="flex flex-col items-center relative">
                                <div
                                    className={classNames(
                                        'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300',
                                        {
                                            'border-primary-600 bg-primary-600 text-[#181a20]': isActive,
                                            'border-success-600 bg-success-600 text-[#181a20]': isCompleted,
                                            'border-gray-700 bg-[#1e2329] text-gray-500': !isActive && !isCompleted,
                                        }
                                    )}
                                >
                                    {isCompleted ? '✓' : index + 1}
                                </div>
                                <div className="absolute top-10 w-max text-center">
                                    <p className={classNames("text-xs font-medium uppercase tracking-wider", {
                                        'text-[#eaecef]': isActive,
                                        'text-success-600': isCompleted,
                                        'text-gray-500': !isActive && !isCompleted
                                    })}>
                                        {step.label}
                                    </p>
                                </div>
                            </div>
                            {!isLast && (
                                <div className={classNames("h-[2px] w-full mx-4", {
                                    'bg-success-600': isCompleted,
                                    'bg-gray-700': !isCompleted
                                })}></div>
                            )}
                        </li>
                    );
                })}
            </ol>
            <div className="h-10"></div> {/* Spacer for labels */}
        </div>
    );
};
