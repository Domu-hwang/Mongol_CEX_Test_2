import React, { useState, useCallback, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { X, UploadCloud } from 'lucide-react';
import { cn } from '../../design-system/cn';

interface FileUploaderProps {
    onFileUpload: (files: File[]) => void;
    acceptedFileTypes?: string[];
    maxFiles?: number;
    label?: string;
    description?: string;
    previewImages?: string[]; // Existing image URLs for display
    onRemoveFile?: (index: number) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    onFileUpload,
    acceptedFileTypes = ['image/*', 'application/pdf'],
    maxFiles = 1,
    label = 'Upload your document',
    description = 'Drag and drop files here, or click to browse',
    previewImages = [],
    onRemoveFile,
}) => {
    const [internalFiles, setInternalFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>(previewImages);

    // Combine initial preview images with newly uploaded files for display
    const allPreviews = [...previews, ...internalFiles.map(file => URL.createObjectURL(file))];

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = maxFiles === 1 ? acceptedFiles.slice(0, 1) : acceptedFiles.slice(0, maxFiles - internalFiles.length);
        setInternalFiles((prev) => (maxFiles === 1 ? newFiles : [...prev, ...newFiles]));
        onFileUpload(maxFiles === 1 ? newFiles : [...internalFiles, ...newFiles]);
    }, [onFileUpload, maxFiles, internalFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes.reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as Record<string, string[]>),
        maxFiles,
    });

    const handleRemove = (fileToRemove: File | string, index: number) => {
        if (typeof fileToRemove === 'string') { // It's an initial preview image
            setPreviews((prev) => prev.filter((_, i) => i !== index));
            onRemoveFile?.(index);
        } else { // It's a newly uploaded file
            setInternalFiles((prev) => prev.filter((file) => file !== fileToRemove));
            onFileUpload(internalFiles.filter((file) => file !== fileToRemove));
        }
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div
                    {...getRootProps()}
                    className={cn(
                        'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors',
                        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                    )}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-center mb-1">{label}</p>
                    <p className="text-xs text-muted-foreground text-center">{description}</p>
                </div>

                {allPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        {allPreviews.map((preview, index) => (
                            <div key={index} className="relative aspect-video rounded-md overflow-hidden border">
                                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent re-triggering dropzone
                                        handleRemove(typeof previewImages[index] === 'string' ? previewImages[index] : internalFiles[index], index);
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
