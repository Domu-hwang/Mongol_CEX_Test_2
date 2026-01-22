import React, { FormEvent, useMemo, useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { COUNTRIES, ID_DOCUMENT_TYPES, KycPolicyKey, getKycPolicyKeyForCountry } from '@/constants/policy';
import { useOnboardingStore } from '@/features/kyc/store/useOnboardingStore';

const MIN_AGE = 18;

export const profileSchema = z.object({
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

const getDocumentOptions = (residence: string, nationality: string): string[] => {
    const residenceKycKey = getKycPolicyKeyForCountry(residence);
    const nationalityKycKey = getKycPolicyKeyForCountry(nationality);

    if (ID_DOCUMENT_TYPES[residenceKycKey]) {
        return ID_DOCUMENT_TYPES[residenceKycKey];
    }
    if (ID_DOCUMENT_TYPES[nationalityKycKey]) {
        return ID_DOCUMENT_TYPES[nationalityKycKey];
    }
    return ID_DOCUMENT_TYPES.default;
};

interface KycProfileFormProps {
    onSubmit?: (payload: z.infer<typeof profileSchema>) => Promise<void> | void;
    onSuccess?: () => void;
    isLoading?: boolean;
}

export const KycProfileForm: React.FC<KycProfileFormProps> = ({ onSubmit, onSuccess, isLoading }) => {
    const { residenceCountry, nationality, setResidenceCountry, setNationality, isPOARequired } = useOnboardingStore((state) => ({
        residenceCountry: state.residenceCountry,
        nationality: state.nationality,
        setResidenceCountry: state.setResidenceCountry,
        setNationality: state.setNationality,
        isPOARequired: state.isPOARequired,
    }));

    const [formData, setFormData] = useState({
        // residenceCountry and nationality are managed by Zustand, but other fields are local
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
        () => getDocumentOptions(residenceCountry, nationality),
        [residenceCountry, nationality]
    );

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const result = profileSchema.safeParse({
            residenceCountry, // Use residenceCountry from Zustand
            nationality, // Use nationality from Zustand
            firstName: formData.firstName,
            familyName: formData.familyName,
            middleName: hasMiddleName ? formData.middleName : undefined,
            dob: formData.dob,
            idType: formData.idType,
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
            onSuccess?.();
        } finally {
            setIsSubmitting(false);
        }
    };

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

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <Label htmlFor="residenceCountry">Residence country</Label>
                    <Select onValueChange={setResidenceCountry} value={residenceCountry}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your country of residence" />
                        </SelectTrigger>
                        <SelectContent>
                            {COUNTRIES.map((country) => (
                                <SelectItem key={country.value} value={country.name}>
                                    {country.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.residenceCountry && <p className="text-destructive-foreground text-sm">{errors.residenceCountry}</p>}
                    <p className="text-sm text-muted-foreground mt-2">
                        {isPOARequired
                            ? 'Proof of Address + Selfie + ID submission is required.'
                            : 'Please prepare Selfie + ID submission. Proof of Address may be requested if needed.'}
                    </p>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Select onValueChange={setNationality} value={nationality}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your nationality" />
                        </SelectTrigger>
                        <SelectContent>
                            {COUNTRIES.map((country) => (
                                <SelectItem key={country.value} value={country.name}>
                                    {country.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                            className="[appearance:none] [color-scheme:dark]"
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
