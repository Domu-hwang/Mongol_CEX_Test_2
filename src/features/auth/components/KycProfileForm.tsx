import React, { FormEvent, useMemo, useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

const MIN_AGE = 18;

const profileSchema = z.object({
    residenceCountry: z.string().min(1, '거주 국가를 선택하세요'),
    nationality: z.string().min(1, '국적을 선택하세요'),
    firstName: z.string().min(1, 'First name을 입력하세요'),
    familyName: z.string().min(1, 'Family name을 입력하세요'),
    middleName: z.string().optional(),
    dob: z
        .string()
        .min(1, '생년월일을 입력하세요')
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
        }, `${MIN_AGE}세 이상만 가입할 수 있습니다.`),
    idType: z.string().min(1, '신분증 타입을 선택하세요'),
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
}

export const KycProfileForm: React.FC<KycProfileFormProps> = ({ onSubmit }) => {
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
                        ? 'Selfie + ID 제출을 준비해주세요. 필요 시 POA 요청이 있을 수 있습니다.'
                        : 'POA + Selfie + ID 제출이 필요합니다.'}
                </p>
            </TabsContent>
        </Tabs>
    );

    return (
        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="space-y-3">
                <p className="text-sm uppercase tracking-wide text-blue-600">KYC-02 정보 입력</p>
                <h2 className="text-2xl font-bold">Identity & document details</h2>
                <p className="text-slate-600">거주 국가와 국적에 따라 필요한 문서가 실시간으로 안내됩니다.</p>
            </div>

            {countryTabs}

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Residence country"
                        placeholder="예: EU, UK, Swiss"
                        value={formData.residenceCountry}
                        onChange={(e) => setFormData((prev) => ({ ...prev, residenceCountry: e.target.value }))}
                        error={errors.residenceCountry}
                    />
                    <Input
                        label="Nationality"
                        placeholder="예: Mongolia"
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
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={hasMiddleName}
                            onChange={(e) => setHasMiddleName(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300"
                        />
                        I have a middle name
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

                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Date of birth"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dob: e.target.value }))}
                        error={errors.dob}
                    />
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">ID document type</label>
                        <select
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            value={formData.idType}
                            onChange={(e) => setFormData((prev) => ({ ...prev, idType: e.target.value }))}
                        >
                            <option value="">문서 유형 선택</option>
                            {documentOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.idType && <p className="mt-1 text-sm text-rose-600">{errors.idType}</p>}
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting} isLoading={isSubmitting}>
                    다음 단계로
                </Button>
            </form>
        </div>
    );
};
