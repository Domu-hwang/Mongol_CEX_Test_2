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
    <div className={classNames('flex w-full gap-1 rounded-xl bg-[#2b3139] p-1.5', className)}>{children}</div>
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
                'flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 focus-visible:outline-none',
                isActive ? 'bg-[#1e2329] text-primary-600 shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
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
