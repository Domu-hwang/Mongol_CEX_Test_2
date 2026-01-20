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
    return (
        <ol className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
            {steps.map((step, index) => {
                const isActive = step.id === currentStepId;
                const isCompleted = steps.findIndex((s) => s.id === currentStepId) > index;

                return (
                    <li key={step.id} className="flex items-start gap-3">
                        <div
                            className={classNames(
                                'mt-1 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold',
                                {
                                    'border-blue-600 bg-blue-600 text-white': isActive,
                                    'border-emerald-500 bg-emerald-500 text-white': isCompleted,
                                    'border-slate-200 bg-white text-slate-500': !isActive && !isCompleted,
                                }
                            )}
                        >
                            {index + 1}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">{step.label}</p>
                            {step.description && <p className="text-sm text-slate-500">{step.description}</p>}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
};
