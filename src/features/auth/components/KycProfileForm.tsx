import React, { FormEvent, useMemo, useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

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
                <p className="text-sm text-slate-500">
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
                <div className="inline-block px-3 py-1 rounded-full bg-primary-600/10 text-primary-600 text-xs font-bold uppercase tracking-widest">
                    Step 2: Identity & Basic Details
                </div>
                <h2 className="text-3xl font-bold text-white">Verification Profile</h2>
                <p className="text-gray-400 leading-relaxed">
                    Provide your legal information as it appears on your identity documents.
                    Verification requirements adjust dynamically based on your residence.
                </p>
            </div>

            <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Residence & Nationality</p>
                {countryTabs}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Residence country"
                        placeholder="e.g., EU, UK, Swiss"
                        value={formData.residenceCountry}
                        onChange={(e) => setFormData((prev) => ({ ...prev, residenceCountry: e.target.value }))}
                        error={errors.residenceCountry}
                    />
                    <Input
                        label="Nationality"
                        placeholder="e.g., Mongolia"
                        value={formData.nationality}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nationality: e.target.value }))}
                        error={errors.nationality}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="First name"
                        value={formData.firstName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                        error={errors.firstName}
                    />
                    <Input
                        label="Family name"
                        value={formData.familyName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, familyName: e.target.value }))}
                        error={errors.familyName}
                    />
                </div>

                <div>
                    <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={hasMiddleName}
                            onChange={(e) => setHasMiddleName(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-700 bg-[#1e2329] text-primary-600 focus:ring-primary-600 focus:ring-offset-0"
                        />
                        <span className="group-hover:text-gray-200 transition-colors">I have a middle name</span>
                    </label>
                    {hasMiddleName && (
                        <Input
                            className="mt-2"
                            label="Middle name"
                            value={formData.middleName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, middleName: e.target.value }))}
                            error={errors.middleName}
                        />
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Date of birth"
                        type="date"
                        className="[appearance:none] [color-scheme:dark]" // Standardize date picker
                        value={formData.dob}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dob: e.target.value }))}
                        error={errors.dob}
                    />
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-400">ID Document Type</label>
                        <div className="relative">
                            <select
                                className="w-full h-[44px] rounded-lg border border-gray-800 bg-[#1e2329] px-4 py-2 text-[#eaecef] appearance-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600"
                                value={formData.idType}
                                onChange={(e) => setFormData((prev) => ({ ...prev, idType: e.target.value }))}
                            >
                                <option value="">Select type</option>
                                {documentOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors.idType && <p className="mt-1.5 text-xs text-danger-600">{errors.idType}</p>}
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting || isLoading} isLoading={isSubmitting || isLoading}>
                    Next Step
                </Button>
            </form>
        </div>
    );
};

export default KycProfileForm;
