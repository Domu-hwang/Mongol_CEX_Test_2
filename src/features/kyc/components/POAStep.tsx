import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { FileUploader } from '@/components/ui/file-uploader';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { MapPin, FileCheck, Shield, Info } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOCUMENT_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];


const poaSchema = z.object({
    addressLine1: z.string().min(1, 'Address Line 1 is required.'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required.'),
    postalCode: z.string().min(1, 'Postal Code is required.'),
    poaDocument: z.any()
        .refine((files) => files?.length > 0, 'Proof of Address document is required.')
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_DOCUMENT_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png, .webp, and .pdf formats are supported."
        ),
});

type PoaFormValues = z.infer<typeof poaSchema>;

export const POAStep: React.FC = () => {
    const { nextStep } = useOnboardingStore();
    const navigate = useNavigate();
    const [poaFile, setPoaFile] = useState<File[]>([]);
    const [poaPreview, setPoaPreview] = useState<string[]>([]);

    const form = useForm<PoaFormValues>({
        resolver: zodResolver(poaSchema),
        defaultValues: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            postalCode: '',
        },
        mode: 'onChange',
    });

    const onSubmit = (values: PoaFormValues) => {
        console.log('POA Data:', values); // Debug log
        nextStep();
    };

    return (
        <OnboardingLayout
            title="Proof of Address"
            description="Provide your current residential address and supporting document."
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Info Notice */}
                    <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Your address must match the document you upload. Document must be dated within the last 3 months.
                        </p>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-foreground">Residential Address</span>
                        </div>

                        <FormField
                            control={form.control}
                            name="addressLine1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">
                                        Address Line 1 <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Street address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="addressLine2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Address Line 2</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Apartment, suite, unit, etc. (optional)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            City <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="City" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            Postal Code <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Postal code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Document Upload Section */}
                    <FormField
                        control={form.control}
                        name="poaDocument"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">
                                    Upload Document <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                    <FileUploader
                                        onFileUpload={(files) => {
                                            field.onChange(files);
                                            setPoaFile(files);
                                            setPoaPreview(files.map(file => URL.createObjectURL(file)));
                                        }}
                                        onRemoveFile={(index) => {
                                            const newFiles = poaFile.filter((_, i) => i !== index);
                                            field.onChange(newFiles);
                                            setPoaFile(newFiles);
                                            setPoaPreview(newFiles.map(file => URL.createObjectURL(file)));
                                        }}
                                        previewImages={poaPreview}
                                        acceptedFileTypes={ACCEPTED_DOCUMENT_TYPES}
                                        maxFiles={1}
                                        description="Upload proof of address (Max 5MB)"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Accepted Documents */}
                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <FileCheck className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-foreground">Accepted Documents</span>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                            <li>Utility bill (electricity, water, gas)</li>
                            <li>Bank or credit card statement</li>
                            <li>Government-issued letter</li>
                            <li>Tax document</li>
                        </ul>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                        disabled={!form.formState.isValid}
                    >
                        Continue
                    </Button>

                    {/* Compliance Notice */}
                    <div className="flex items-start gap-2 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                        <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Your address documents are securely processed and stored in compliance with data protection regulations.
                        </p>
                    </div>
                </form>
            </Form>
        </OnboardingLayout>
    );
};
