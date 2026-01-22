import React, { FormEvent, useMemo, useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const MIN_AGE = 18;

const profileSchema = z.object({
    residenceCountry: z.string().min(1, 'Please select your country of residence'),
    nationality: z.string().min(1, 'Please select your nationality'),
    firstName: z.string().min(1, 'Please enter your first name'),
    familyName: z.string().min(1, 'Please enter your family name'),
    middleName: z.string().optional(),
    dob: z
        .string()
        .min(1, 'Please enter your date of birth')
        .refine((value) => {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const adjustedAge =
                today.getMonth() < birthDate.getMonth() ||
                    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
                    ? age - 1
                    : age;
            return adjustedAge >= MIN_AGE;
        }, `You must be at least ${MIN_AGE} years old to register.`),
    idType: z.string().min(1, 'Please select an ID document type'),
});

const documentGuide: Record<string, string[]> = {
    EU: ['Passport', 'National ID card', 'Residence permit'],
    UK: ['Passport', 'Driving license', 'Biometric residence permit'],
    Swiss: ['Passport', 'Swiss ID', 'B permit'],
    Australia: ['Passport', 'Driver license', 'Medicare card'],
    default: ['Passport', 'National ID card'],
};

const getDocumentOptions = (residence: string, nationality: string): string[] => {
    const target = [residence, nationality].find((country) =>
        ['EU', 'UK', 'Swiss', 'Australia'].includes(country)
    );
    if (target) {
        return documentGuide[target];
    }
    return documentGuide.default;
};

interface KycProfileFormProps {
    onSubmit?: (payload: z.infer<typeof profileSchema>) => Promise<void> | void;
    onSuccess?: () => void; // Add onSuccess callback
    isLoading?: boolean; // Add isLoading prop
}

export const KycProfileForm: React.FC<KycProfileFormProps> = ({ onSubmit, onSuccess, isLoading }) => {
    const [formData, setFormData] = useState({
        residenceCountry: '',
        nationality: '',
        firstName: '',
        familyName: '',
        middleName: '',
        dob: '',
        idType: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasMiddleName, setHasMiddleName] = useState(false);

    const documentOptions = useMemo(
        () => getDocumentOptions(formData.residenceCountry, formData.nationality),
        [formData.residenceCountry, formData.nationality]
    );

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const result = profileSchema.safeParse({
            ...formData,
            middleName: hasMiddleName ? formData.middleName : undefined,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                residenceCountry: fieldErrors.residenceCountry?.[0] || '',
                nationality: fieldErrors.nationality?.[0] || '',
                firstName: fieldErrors.firstName?.[0] || '',
                familyName: fieldErrors.familyName?.[0] || '',
                middleName: fieldErrors.middleName?.[0] || '',
                dob: fieldErrors.dob?.[0] || '',
                idType: fieldErrors.idType?.[0] || '',
            });
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            await onSubmit?.(result.data);
            onSuccess?.(); // Call onSuccess if provided
        } finally {
            setIsSubmitting(false);
        }
    };

    const countryTabs = (
        <Tabs defaultValue="EU" value={formData.residenceCountry || undefined}>
            <TabsList className="mb-3">
                {['EU', 'UK', 'Swiss', 'Australia', 'Other'].map((region) => (
                    <TabsTrigger
                        key={region}
                        value={region === 'Other' ? 'Other' : region}
                        onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                residenceCountry: region === 'Other' ? 'Other' : region,
                            }))
                        }
                    >
                        {region}
                    </TabsTrigger>
                ))}
            </TabsList>
            <TabsContent value={formData.residenceCountry || 'EU'}>
                <p className="text-sm text-muted-foreground">
                    {formData.residenceCountry === 'Other'
                        ? 'Please prepare Selfie + ID submission. POA may be requested if needed.'
                        : 'POA + Selfie + ID submission is required.'}
                </p>
            </TabsContent>
        </Tabs>
    );

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                    Step 2: Identity & Basic Details
                </div>
                <h2 className="text-3xl font-bold text-foreground">Verification Profile</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Provide your legal information as it appears on your identity documents.
                    Verification requirements adjust dynamically based on your residence.
                </p>
            </div>

            <div className="space-y-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Residence & Nationality</p>
                {countryTabs}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <Label htmlFor="residenceCountry">Residence country</Label>
                    <Input
                        id="residenceCountry"
                        placeholder="e.g., EU, UK, Swiss"
                        value={formData.residenceCountry}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, residenceCountry: e.target.value }))}
                    />
                    {errors.residenceCountry && <p className="text-destructive-foreground text-sm">{errors.residenceCountry}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                        id="nationality"
                        placeholder="e.g., Mongolia"
                        value={formData.nationality}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, nationality: e.target.value }))}
                    />
                    {errors.nationality && <p className="text-destructive-foreground text-sm">{errors.nationality}</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                        />
                        {errors.firstName && <p className="text-destructive-foreground text-sm">{errors.firstName}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="familyName">Family name</Label>
                        <Input
                            id="familyName"
                            value={formData.familyName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, familyName: e.target.value }))}
                        />
                        {errors.familyName && <p className="text-destructive-foreground text-sm">{errors.familyName}</p>}
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={hasMiddleName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHasMiddleName(e.target.checked)}
                            className="h-5 w-5 rounded border-input bg-background text-primary focus:ring-primary focus:ring-offset-0"
                        />
                        <span className="group-hover:text-foreground transition-colors">I have a middle name</span>
                    </label>
                    {hasMiddleName && (
                        <div className="grid gap-2 mt-2">
                            <Label htmlFor="middleName">Middle name</Label>
                            <Input
                                id="middleName"
                                value={formData.middleName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, middleName: e.target.value }))}
                            />
                            {errors.middleName && <p className="text-destructive-foreground text-sm">{errors.middleName}</p>}
                        </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="dob">Date of birth</Label>
                        <Input
                            id="dob"
                            type="date"
                            className="[appearance:none] [color-scheme:dark]" // Standardize date picker
                            value={formData.dob}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, dob: e.target.value }))}
                        />
                        {errors.dob && <p className="text-destructive-foreground text-sm">{errors.dob}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="idType">ID Document Type</Label>
                        <div className="relative">
                            <select
                                id="idType"
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.idType}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData((prev) => ({ ...prev, idType: e.target.value }))}
                            >
                                <option value="">Select type</option>
                                {documentOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors.idType && <p className="mt-1.5 text-destructive-foreground text-sm">{errors.idType}</p>}
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting || isLoading} variant="default">
                    Next Step
                </Button>
            </form>
        </div>
    );
};

export default KycProfileForm;
