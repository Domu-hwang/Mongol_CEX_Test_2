import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription, // Added FormDescription
} from '@/components/ui/form';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { subYears, isBefore } from 'date-fns';

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    dob: z.date().refine((date) => {
        const eighteenYearsAgo = subYears(new Date(), 18);
        return isBefore(date, eighteenYearsAgo);
    }, 'You must be at least 18 years old.'),
    hasMiddleName: z.boolean().default(false).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileStep: React.FC = () => {
    const { nextStep } = useOnboardingStore();
    const navigate = useNavigate();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            dob: undefined,
            hasMiddleName: false,
        },
        mode: 'onChange',
    });

    const hasMiddleName = form.watch('hasMiddleName');
    const dob = form.watch('dob');
    const isUnder18 = dob ? !isBefore(dob, subYears(new Date(), 18)) : true;

    const onSubmit = (values: ProfileFormValues) => {
        console.log('Profile Data:', values);
        nextStep();
    };

    return (
        <OnboardingLayout title="Personal Information">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="hasMiddleName"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        I have a middle name
                                    </FormLabel>
                                    <FormDescription>
                                        Check this box if you have a middle name.
                                    </FormDescription>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {hasMiddleName && (
                        <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle Name (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Middle" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        placeholder="Pick your date of birth"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isUnder18 && (
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Age Restriction</AlertTitle>
                            <AlertDescription>
                                You must be at least 18 years old to continue.
                            </AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isUnder18 || !form.formState.isValid}>
                        Continue
                    </Button>
                </form>
            </Form>
        </OnboardingLayout>
    );
};
