// @ts-nocheck
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
    Controller,
    FormProvider,
    useFormContext,
    FieldPath,
    FieldValues,
    ControllerProps,
    UseFormReturn,
    FieldError,
} from "react-hook-form"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../design-system/cn"

const Form = FormProvider

type FormItemContextValue = {
    id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const id = React.useId()

    return (
        <FormItemContext.Provider value={{ id }}>
            <div className={cn("space-y-2", className)} {...props} />
        </FormItemContext.Provider>
    )
}
FormItem.displayName = "FormItem"

function FormField<
    TField extends FieldPath<FieldValues> = FieldPath<FieldValues>,
    TForm extends FieldValues = FieldValues,
>({
    ...props
}: ControllerProps<TForm, TField>) {
    return (
        <Controller
            {...props}
            render={({ field, fieldState, formState }) => {
                // Here, the actual field component will be rendered.
                // useFormField will pick up context from the FormProvider established by <Form {...form}>
                const itemContext = React.useContext(FormItemContext);
                if (!itemContext) {
                    throw new Error("FormField components must be wrapped in a <FormItem />");
                }
                const { id } = itemContext;
                const { error } = fieldState;

                // Pass down required props to the render prop
                const renderProps = { field, fieldState, formState, id, error };
                return props.render(renderProps as any); // Cast to any to pass custom props
            }}
        />
    );
}

function useFormField() {
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext(); // Directly use useFormContext

    if (!itemContext) {
        throw new Error("useFormField must be used within <FormItem>");
    }

    const fieldName = itemContext.id.split('-form-item')[0] as FieldPath<FieldValues>; // Infer field name from item ID
    const fieldState = getFieldState(fieldName, formState);

    return {
        id: itemContext.id,
        name: fieldName,
        formItem: {
            htmlFor: itemContext.id,
        },
        formDescription: {
            id: `${itemContext.id}-form-item-description`,
        },
        formMessage: {
            id: `${itemContext.id}-form-item-message`,
        },
        ...fieldState,
    };
}

const FormLabel = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
    const { error, formItem } = useFormField();

    return (
        <LabelPrimitive.Root
            ref={ref}
            className={cn(error && "text-destructive", className)}
            {...formItem}
            {...props}
        />
    );
});
FormLabel.displayName = LabelPrimitive.Root.displayName;

const FormControl = React.forwardRef<
    React.ElementRef<typeof Slot>,
    React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
    const { error, formItem } = useFormField();

    return (
        <Slot
            ref={ref}
            id={formItem.htmlFor}
            aria-describedby={
                !error
                    ? `${formItem.htmlFor}-form-item-description`
                    : `${formItem.htmlFor}-form-item-description ${formItem.htmlFor}-form-item-message`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    const { formDescription } = useFormField();

    return (
        <p
            ref={ref}
            className={cn("text-[0.8rem] text-muted-foreground", className)}
            {...formDescription}
            {...props}
        />
    );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    const { error, formMessage } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p
            ref={ref}
            className={cn("text-[0.8rem] font-medium text-destructive", className)}
            {...formMessage}
            {...props}
        >
            {body}
        </p>
    );
});
FormMessage.displayName = "FormMessage";

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
};
