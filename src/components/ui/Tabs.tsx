import React, { createContext, useContext, useMemo, useState } from 'react';
import classNames from 'classnames';

interface TabsContextValue {
    value: string;
    setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, value, onValueChange, children }) => {
    const [internalValue, setInternalValue] = useState(defaultValue);

    const currentValue = value ?? internalValue;

    const contextValue = useMemo<TabsContextValue>(
        () => ({
            value: currentValue,
            setValue: (nextValue: string) => {
                if (!value) {
                    setInternalValue(nextValue);
                }
                onValueChange?.(nextValue);
            },
        }),
        [currentValue, value, onValueChange]
    );

    return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
};

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={classNames('flex w-full gap-2 rounded-xl bg-slate-100 p-1', className)}>{children}</div>
);

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, ...props }) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('TabsTrigger must be used within Tabs');
    }
    const isActive = context.value === value;
    return (
        <button
            type="button"
            onClick={(event) => {
                props.onClick?.(event);
                context.setValue(value);
            }}
            className={classNames(
                'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export const TabsContent: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('TabsContent must be used within Tabs');
    }
    if (context.value !== value) {
        return null;
    }
    return <div className="mt-4">{children}</div>;
};
