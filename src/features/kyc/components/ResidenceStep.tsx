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
    FormDescription,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, FileText, Info } from 'lucide-react';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { REGULATED_COUNTRIES } from '@/constants/policy';

const residenceSchema = z.object({
    residenceCountry: z.string().min(1, 'Please select your country of residence.'),
});

type ResidenceFormValues = z.infer<typeof residenceSchema>;

interface ResidenceStepProps {
    onSuccess?: () => void;
}

export const ResidenceStep: React.FC<ResidenceStepProps> = ({ onSuccess }) => {
    const { residenceCountry, setResidenceCountry } = useOnboardingStore();
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
        onSuccess?.(); // Call onSuccess callback
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
        <OnboardingLayout
            title="Country of Residence"
            description="Select the country where you currently reside."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Info Notice */}
                    <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Your country of residence determines which services are available to you and any additional verification requirements.
                        </p>
                    </div>

                    <FormField
                        control={form.control}
                        name="residenceCountry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">
                                    Country of Residence <span className="text-destructive">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-11">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <SelectValue placeholder="Select your country" />
                                            </div>
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
                                <FormDescription className="text-xs">
                                    This should be the country where you have proof of address.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {showAlert && (
                        <Alert className="bg-yellow-500/5 border-yellow-500/30">
                            <FileText className="h-4 w-4 text-yellow-500" />
                            <AlertTitle className="text-yellow-600">Additional Document Required</AlertTitle>
                            <AlertDescription className="text-muted-foreground">
                                Based on your selected country, you will need to provide proof of address (utility bill, bank statement, etc.) in a later step.
                            </AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                    >
                        Continue
                    </Button>

                    {/* Compliance Note */}
                    <p className="text-xs text-muted-foreground text-center">
                        We verify your residence to comply with financial regulations and protect against fraud.
                    </p>
                </form>
            </Form>
        </OnboardingLayout>
    );
};
