import React, { useState, createContext, useContext, ReactNode } from 'react';
import { cn, tabsStyles } from '@/design-system';

// Context to share active tab state
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: 'default' | 'underline';
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within the Tabs parent component');
  }
  return context;
};

// Tabs component (parent)
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'underline';
  className?: string;
  children: ReactNode;
}

const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant = 'default',
  className,
  children,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue || '');

  const activeTab = controlledValue !== undefined ? controlledValue : internalActiveTab;
  const setActiveTab = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

// TabsList component
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ children, className, ...props }) => {
  const { variant } = useTabsContext();

  return (
    <div
      role="tablist"
      className={cn(
        variant === 'underline' ? tabsStyles.listUnderline : tabsStyles.list,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// TabsTrigger component
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
  ...props
}) => {
  const { activeTab, setActiveTab, variant } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => setActiveTab(value)}
      className={cn(
        variant === 'underline' ? tabsStyles.triggerUnderline : tabsStyles.trigger,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// TabsContent component
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
  ...props
}) => {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      data-state={activeTab === value ? 'active' : 'inactive'}
      className={cn(tabsStyles.content, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
export default Tabs;
