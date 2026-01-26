import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { SANCTIONED_COUNTRIES, ID_DOCUMENT_TYPES } from '@/constants/policy';
import { FileUploader } from '@/components/ui/file-uploader';
import { FileCheck, AlertTriangle, Shield } from 'lucide-react';

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
});

type DocumentUploadFormValues = z.infer<typeof documentUploadSchema>;

export const DocumentUploadStep: React.FC = () => {
    const { nationality, setNationality, nextStep } = useOnboardingStore();
    const navigate = useNavigate();
    const [isSanctioned, setIsSanctioned] = useState(false);
    const [frontFile, setFrontFile] = useState<File[]>([]);
    const [frontPreview, setFrontPreview] = useState<string[]>([]);

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
        <OnboardingLayout
            title="Identity Verification"
            description="Upload a valid government-issued ID document."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">
                                    Nationality <span className="text-destructive">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your nationality" />
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

                    {/* Sanctioned Country Dialog */}
                    {isSanctioned && (
                        <Dialog open={isSanctioned} onOpenChange={setIsSanctioned}>
                            <DialogContent>
                                <DialogHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-5 h-5 text-destructive" />
                                        <DialogTitle className="text-destructive">Service Unavailable</DialogTitle>
                                    </div>
                                    <DialogDescription className="text-left">
                                        Due to regulatory restrictions, we are unable to provide services to residents of {selectedNationality}.
                                        If you believe this is an error, please contact our support team.
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
                                <FormLabel className="text-foreground">
                                    Document Type <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-2"
                                    >
                                        {allowedDocumentTypes.map((docType) => (
                                            <FormItem
                                                key={docType}
                                                className="flex items-center space-x-3 space-y-0 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                                            >
                                                <FormControl>
                                                    <RadioGroupItem value={docType} />
                                                </FormControl>
                                                <FormLabel className="font-normal text-foreground cursor-pointer flex-1">
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
                                <FormLabel className="text-foreground">
                                    Upload Document <span className="text-destructive">*</span>
                                </FormLabel>
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
                                            setFrontPreview(newFiles.map(file => URL.createObjectURL(file)));
                                        }}
                                        previewImages={frontPreview}
                                        acceptedFileTypes={ACCEPTED_IMAGE_TYPES}
                                        maxFiles={1}
                                        description="Upload a clear photo of your ID (Max 5MB)"
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Accepted formats: JPG, PNG, PDF. Ensure all details are clearly visible.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Document Tips */}
                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <FileCheck className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-foreground">Document Requirements</span>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                            <li>Document must be valid and not expired</li>
                            <li>All corners must be visible in the photo</li>
                            <li>Text must be clear and readable</li>
                            <li>No glare or blurriness</li>
                        </ul>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                        disabled={isSanctioned || !form.formState.isValid}
                    >
                        Continue
                    </Button>

                    {/* Compliance Notice */}
                    <div className="flex items-start gap-2 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                        <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Your documents are encrypted and securely stored. We comply with AML/KYC regulations and your data will only be used for identity verification purposes.
                        </p>
                    </div>
                </form>
            </Form>
        </OnboardingLayout>
    );
};
