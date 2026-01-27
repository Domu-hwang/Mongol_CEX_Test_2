import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { subYears, isBefore } from 'date-fns';
import { KycSubmissionData } from '../types';
import { User, Info } from 'lucide-react';

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

interface ProfileStepProps {
    onSuccess?: () => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({ onSuccess }) => {
    const { nextStep, setProfileData } = useOnboardingStore();
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
        setProfileData({ ...values, dob: values.dob?.toISOString() } as KycSubmissionData);
        onSuccess?.();
        nextStep();
    };

    return (
        <OnboardingLayout
            title="Personal Information"
            description="Please enter your legal name exactly as it appears on your ID document."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Info Notice */}
                    <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg mb-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Your name must match your government-issued ID for verification purposes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">First Name <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hasMiddleName"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border border-border p-3 bg-muted/30">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-0.5 leading-none">
                                        <FormLabel className="text-sm font-normal text-foreground cursor-pointer">
                                            I have a middle name
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {hasMiddleName && (
                            <FormField
                                control={form.control}
                                name="middleName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Middle Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your middle name" {...field} />
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
                                    <FormLabel className="text-foreground">Last Name <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your last name" {...field} />
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
                                    <FormLabel className="text-foreground">Date of Birth <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                            placeholder="Select your date of birth"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        You must be at least 18 years old to use our services.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                        disabled={isUnder18 || !form.formState.isValid}
                    >
                        Continue
                    </Button>

                    {/* Data Protection Notice */}
                    <p className="text-xs text-muted-foreground text-center">
                        Your personal data is processed securely in accordance with our{' '}
                        <a href="/legal" className="text-yellow-500 hover:underline">Privacy Policy</a>.
                    </p>
                </form>
            </Form>
        </OnboardingLayout>
    );
};
