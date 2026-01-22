import React, { useState, useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '../store/useOnboardingStore'; // Corrected relative import path
import { SANCTIONED_COUNTRIES, ID_DOCUMENT_TYPES } from '@/constants/policy';
import { FileUploader } from '@/components/ui/file-uploader'; // Import FileUploader

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

const documentUploadSchema = z.object({
    nationality: z.string().min(1, 'Please select your nationality.'),
    idDocumentType: z.string().min(1, 'Please select an ID document type.'),
    documentFront: z.any()
        .refine((files) => files?.length > 0, 'Document front is required.')
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png, .webp, and .pdf formats are supported."
        ),
    documentBack: z.any()
        .refine((files) => files?.length > 0, 'Document back is required.')
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png, .webp, and .pdf formats are supported."
        ),
});

type DocumentUploadFormValues = z.infer<typeof documentUploadSchema>;

export const DocumentUploadStep: React.FC = () => {
    const { nationality, setNationality, nextStep } = useOnboardingStore();
    const navigate = useNavigate();
    const [isSanctioned, setIsSanctioned] = useState(false);
    const [frontFile, setFrontFile] = useState<File[]>([]);
    const [backFile, setBackFile] = useState<File[]>([]);
    const [frontPreview, setFrontPreview] = useState<string[]>([]);
    const [backPreview, setBackPreview] = useState<string[]>([]);

    const form = useForm<DocumentUploadFormValues>({
        resolver: zodResolver(documentUploadSchema),
        defaultValues: {
            nationality: nationality || '',
            idDocumentType: '',
        },
        mode: 'onChange',
    });

    const selectedNationality = form.watch('nationality');
    const allowedDocumentTypes = ID_DOCUMENT_TYPES[selectedNationality] || ID_DOCUMENT_TYPES.default;

    React.useEffect(() => {
        setIsSanctioned(SANCTIONED_COUNTRIES.includes(selectedNationality));
        if (SANCTIONED_COUNTRIES.includes(selectedNationality)) {
            console.log("Sanctioned country selected!"); // Debug log
        }
    }, [selectedNationality]);

    const onSubmit = (values: DocumentUploadFormValues) => {
        setNationality(values.nationality);
        console.log('Document Upload Data:', values); // Debug log
        nextStep();
    };

    const nationalities = [
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
        <OnboardingLayout title="Nationality & ID Document">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select your Nationality</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a nationality" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {nationalities.map((nat) => (
                                            <SelectItem key={nat.value} value={nat.value}>
                                                {nat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isSanctioned && (
                        <Dialog open={isSanctioned} onOpenChange={setIsSanctioned}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-destructive">Restricted Nationality</DialogTitle>
                                    <DialogDescription>
                                        Unfortunately, we cannot provide services to citizens of {selectedNationality}.
                                        Please contact support for more information.
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    )}

                    <FormField
                        control={form.control}
                        name="idDocumentType"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Select ID Document Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {allowedDocumentTypes.map((docType) => (
                                            <FormItem key={docType} className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={docType} />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {docType}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="documentFront"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Front of ID Document</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        onFileUpload={(files) => {
                                            field.onChange(files);
                                            setFrontFile(files);
                                            setFrontPreview(files.map(file => URL.createObjectURL(file)));
                                        }}
                                        onRemoveFile={(index) => {
                                            const newFiles = frontFile.filter((_, i) => i !== index);
                                            field.onChange(newFiles);
                                            setFrontFile(newFiles);
                                            setFrontPreview(newFiles.map(file => URL.createObjectURL(newFiles[index])));
                                        }}
                                        previewImages={frontPreview}
                                        acceptedFileTypes={ACCEPTED_IMAGE_TYPES}
                                        maxFiles={1}
                                        description="Upload the front side of your selected ID document (Max 5MB, JPG, PNG, PDF)"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="documentBack"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Back of ID Document</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        onFileUpload={(files) => {
                                            field.onChange(files);
                                            setBackFile(files);
                                            setBackPreview(files.map(file => URL.createObjectURL(file)));
                                        }}
                                        onRemoveFile={(index) => {
                                            const newFiles = backFile.filter((_, i) => i !== index);
                                            field.onChange(newFiles);
                                            setBackFile(newFiles);
                                            setBackPreview(newFiles.map(file => URL.createObjectURL(newFiles[index])));
                                        }}
                                        previewImages={backPreview}
                                        acceptedFileTypes={ACCEPTED_IMAGE_TYPES}
                                        maxFiles={1}
                                        description="Upload the back side of your selected ID document (Max 5MB, JPG, PNG, PDF)"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isSanctioned || !form.formState.isValid}>
                        Continue
                    </Button>
                </form>
            </Form>
        </OnboardingLayout>
    );
};
