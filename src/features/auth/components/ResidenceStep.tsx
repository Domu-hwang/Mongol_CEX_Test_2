import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react'; // Example icon for Alert
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { REGULATED_COUNTRIES } from '@/constants/policy';

const residenceSchema = z.object({
    residenceCountry: z.string().min(1, 'Please select your country of residence.'),
});

type ResidenceFormValues = z.infer<typeof residenceSchema>;

export const ResidenceStep: React.FC = () => {
    const { residenceCountry, setResidenceCountry, nextStep } = useOnboardingStore();
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);

    const form = useForm<ResidenceFormValues>({
        resolver: zodResolver(residenceSchema),
        defaultValues: {
            residenceCountry: residenceCountry || '',
        },
    });

    const selectedCountry = form.watch('residenceCountry');
    const isPOARequired = REGULATED_COUNTRIES.includes(selectedCountry);

    React.useEffect(() => {
        setShowAlert(isPOARequired);
    }, [isPOARequired]);

    const onSubmit = (values: ResidenceFormValues) => {
        setResidenceCountry(values.residenceCountry);
        nextStep();
    };

    const countries = [
        { label: 'United States', value: 'US' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Germany', value: 'DE' },
        { label: 'France', value: 'FR' },
        { label: 'Switzerland', value: 'CH' },
        { label: 'Australia', value: 'AU' },
        { label: 'South Korea', value: 'KR' },
        { label: 'Japan', value: 'JP' },
        { label: 'Cuba', value: 'CU' },
        { label: 'Iran', value: 'IR' },
        { label: 'North Korea', value: 'KP' },
        { label: 'Syria', value: 'SY' },
        { label: 'Other', value: 'OTHER' },
    ];

    return (
        <OnboardingLayout title="Country of Residence">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="residenceCountry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select your country of residence</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.value} value={country.value}>
                                                {country.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {showAlert && (
                        <Alert variant="secondary">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Proof of Address Required</AlertTitle>
                            <AlertDescription>
                                Your selected country is a regulated region. You will be required to upload proof of address documents.
                            </AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full">
                        Continue
                    </Button>
                </form>
            </Form>
        </OnboardingLayout>
    );
};
