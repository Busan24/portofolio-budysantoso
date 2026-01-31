"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";
import { cn } from "@/lib/utils";

const ImageUpload = ({ value, onChange, className }) => {
    const [preview, setPreview] = useState(value || null);
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        // Handle rejected files
        if (rejectedFiles && rejectedFiles.length > 0) {
            const error = rejectedFiles[0].errors[0];
            if (error.code === 'file-too-large') {
                console.error("File too large. Maximum size is 10MB");
                alert("File terlalu besar! Maksimal 10MB");
            } else if (error.code === 'file-invalid-type') {
                console.error("Invalid file type. Only PNG, JPG, JPEG, WEBP, GIF allowed");
                alert("Format file tidak valid! Gunakan PNG, JPG, JPEG, WEBP, atau GIF");
            }
            return;
        }

        const file = acceptedFiles[0];
        if (file) {
            console.log("File selected:", {
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                type: file.type
            });
            
            setLoading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setLoading(false);
                console.log("Preview loaded successfully");
            };
            reader.onerror = () => {
                console.error("Error reading file");
                setLoading(false);
                alert("Error membaca file. Silakan coba lagi.");
            };
            reader.readAsDataURL(file);
            onChange(file);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB 
    });

    const handleRemove = (e) => {
        e.stopPropagation();
        setPreview(null);
        onChange(null);
    };

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative border-2 border-dashed rounded-xl transition-all cursor-pointer",
                isDragActive
                    ? "border-accent bg-accent/5"
                    : "border-white/20 hover:border-white/40",
                className
            )}
        >
            <input {...getInputProps()} />

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="mt-3 text-sm text-white/60">Uploading...</p>
                </div>
            ) : preview ? (
                <div className="relative aspect-video">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-contain rounded-lg"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                        <FiX size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        {isDragActive ? (
                            <FiUploadCloud size={28} className="text-accent" />
                        ) : (
                            <FiImage size={28} className="text-white/40" />
                        )}
                    </div>
                    <p className="text-sm text-white/70 text-center">
                        {isDragActive ? (
                            "Drop the image here"
                        ) : (
                            <>
                                <span className="text-accent font-medium">Click to upload</span>
                                {" "}or drag and drop
                            </>
                        )}
                    </p>
                    <p className="text-xs text-white/40 mt-1">PNG, JPG up to 10MB</p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
