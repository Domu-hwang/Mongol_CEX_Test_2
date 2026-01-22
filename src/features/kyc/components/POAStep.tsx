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
} from '@/components/ui/form';
import { FileUploader } from '@/components/ui/file-uploader';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '../store/useOnboardingStore'; // Corrected relative import path

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
        <OnboardingLayout title="Proof of Address">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address Line 1</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Main St" {...field} />
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
                                <FormLabel>Address Line 2 (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Apartment, suite, unit, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="New York" {...field} />
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
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="10001" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="poaDocument"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Proof of Address Document</FormLabel>
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
                                            setPoaPreview(newFiles.map(file => URL.createObjectURL(newFiles[index])));
                                        }}
                                        previewImages={poaPreview}
                                        acceptedFileTypes={ACCEPTED_DOCUMENT_TYPES}
                                        maxFiles={1}
                                        description="Upload a utility bill, bank statement, or similar (Max 5MB, JPG, PNG, PDF)"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                        Submit for Review
                    </Button>
                </form>
            </Form>
        </OnboardingLayout>
    );
};
