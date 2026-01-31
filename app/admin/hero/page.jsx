"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ImageUpload from "@/components/admin/ImageUpload";
import { motion } from "framer-motion";
import { FiSave, FiExternalLink, FiPlus, FiX, FiLoader } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { showToast } from "@/components/ui/toast";

// Firebase imports (only Firestore, NOT Storage)
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Cloudinary imports
import { uploadToCloudinary } from "@/lib/cloudinary";

const socialIcons = {
    github: FaGithub,
    linkedin: FaLinkedin,
    instagram: FaInstagram,
    youtube: FaYoutube,
    twitter: FaTwitter,
};

const defaultData = {
    name: "Budy Santoso",
    roles: ["Software Engineering", "Frontend Developer", "UI/UX Designer"],
    description: "As a Software Engineering enthusiast, I have been actively involved in developing both web-based and mobile applications through various academic and independent projects.",
    photo: "/assets/photo.png",
    cvUrl: "/assets/CV_BudySantoso.pdf",
    socialLinks: [
        { platform: "github", url: "https://github.com/budysantoso" },
        { platform: "linkedin", url: "https://linkedin.com/in/budysantoso" },
    ],
};

export default function HeroPage() {
    const [formData, setFormData] = useState(defaultData);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [photoFile, setPhotoFile] = useState(null);
    const [cvFile, setCvFile] = useState(null);

    // Fetch hero data from Firestore
    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        try {
            const docRef = doc(db, "settings", "hero");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFormData({ ...defaultData, ...docSnap.data() });
            }
        } catch (error) {
            console.error("Error fetching hero data:", error);
        } finally {
            setPageLoading(false);
        }
    };

    const uploadImage = async (file) => {
        if (!file) return null;
        try {
            console.log("Uploading to Cloudinary...");
            const result = await uploadToCloudinary(file, 'hero');
            console.log("Cloudinary upload successful:", result);
            
            return {
                url: result.url,
                publicId: result.publicId
            };
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let photoUrl = formData.photo;
            let photoPublicId = formData.photoPublicId || null;
            let cvUrl = formData.cvUrl;

            if (photoFile) {
                const uploadResult = await uploadImage(photoFile);
                if (uploadResult) {
                    photoUrl = uploadResult.url;
                    photoPublicId = uploadResult.publicId;
                }
            }

            if (cvFile) {
                try {
                    console.log("Uploading CV to Cloudinary...");
                    const cvUploadResult = await uploadToCloudinary(cvFile, 'cv');
                    cvUrl = cvUploadResult.url;
                    console.log("CV uploaded successfully:", cvUrl);
                } catch (error) {
                    console.error("Error uploading CV:", error);
                    showToast.error("Failed to upload CV file");
                    setLoading(false);
                    return;
                }
            }

            const heroData = {
                name: formData.name,
                roles: formData.roles || ["Software Engineering"],
                description: formData.description,
                photo: photoUrl,
                photoPublicId: photoPublicId,
                cvUrl: cvUrl,
                socialLinks: formData.socialLinks,
                updatedAt: serverTimestamp(),
            };

            await setDoc(doc(db, "settings", "hero"), heroData);
            setFormData(prev => ({ ...prev, ...heroData }));
            setPhotoFile(null);
            setCvFile(null);
            showToast.success("Hero section updated successfully!");
        } catch (error) {
            console.error("Error saving hero data:", error);
            showToast.error("Failed to save hero section");
        } finally {
            setLoading(false);
        }
    };

    const addSocialLink = () => {
        setFormData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { platform: "github", url: "" }]
        }));
    };

    const removeSocialLink = (index) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index)
        }));
    };

    const updateSocialLink = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.map((link, i) =>
                i === index ? { ...link, [field]: value } : link
            )
        }));
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-primary">
                <AdminHeader title="Hero Section" />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="flex flex-col items-center gap-4">
                        <FiLoader className="w-8 h-8 text-accent animate-spin" />
                        <p className="text-white/60">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader title="Hero Section" />

            <div className="p-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* 1. Profile Image (Left Top) */}
                        <Card className="xl:col-span-1 bg-[#27272c] border-white/10 shadow-lg overflow-hidden h-full">
                            <CardHeader className="bg-white/5 pb-4">
                                <CardTitle className="text-xl text-accent">Profile Image</CardTitle>
                                <CardDescription className="text-white/60">Upload your professional photo</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 flex flex-col items-center">
                                <div className="w-full max-w-[280px] mx-auto aspect-square mb-6 relative group">
                                    <div className="absolute inset-0 bg-accent/10 rounded-xl rotate-3 scale-95 group-hover:rotate-6 transition-transform duration-300"></div>
                                    <div className="relative bg-[#1e1e24] p-2 rounded-xl border border-white/10 shadow-2xl h-full w-full">
                                        <ImageUpload
                                            value={formData.photo}
                                            onChange={(file) => {
                                                if (file) {
                                                    setPhotoFile(file);
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData(prev => ({ ...prev, photo: reader.result }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="text-center w-full">
                                    <p className="text-sm text-white/50 mb-1">Recommended: Square format (1:1)</p>
                                    <p className="text-xs text-white/30">Max 10MB • JPG, PNG, WEBP</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Professional Identity (Right Top) */}
                        <Card className="xl:col-span-2 bg-[#27272c] border-white/10 shadow-lg h-full">
                            <CardHeader className="bg-white/5 flex flex-row items-center justify-between pb-4">
                                <div>
                                    <CardTitle className="text-xl text-accent">Professional Identity</CardTitle>
                                    <CardDescription className="text-white/60">Define your roles and bio</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8 pt-6">
                                {/* Roles */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-white/80">Rotating Roles / Titles</label>
                                        <Button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                roles: [...(prev.roles || []), ""]
                                            }))}
                                            size="sm"
                                            variant="outline"
                                            className="rounded-full border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300 px-4"
                                        >
                                            <FiPlus className="mr-2" /> Add Role
                                        </Button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(formData.roles || ["Software Engineering"]).map((role, index) => (
                                            <motion.div 
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="relative group"
                                            >
                                                <Input
                                                    type="text"
                                                    value={role}
                                                    onChange={(e) => {
                                                        const newRoles = [...(formData.roles || [])];
                                                        newRoles[index] = e.target.value;
                                                        setFormData(prev => ({ ...prev, roles: newRoles }));
                                                    }}
                                                    placeholder={`Role #${index + 1}`}
                                                    className="bg-primary border-white/10 h-11 pr-10 focus:border-accent text-white"
                                                    required
                                                />
                                                {(formData.roles || []).length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newRoles = formData.roles.filter((_, i) => i !== index);
                                                            setFormData(prev => ({ ...prev, roles: newRoles }));
                                                        }}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/20 hover:text-red-400 transition-colors bg-primary rounded-md"
                                                        title="Remove role"
                                                    >
                                                        <FiX size={16} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                    {(!formData.roles || formData.roles.length === 0) && (
                                        <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl">
                                            <p className="text-white/40 text-sm">No roles added yet.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Short Bio / Description</label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Write a brief introduction about yourself..."
                                        className="bg-primary border-white/10 min-h-[140px] focus:border-accent text-white leading-relaxed resize-none p-4"
                                        required
                                    />
                                    <p className="text-xs text-right text-white/30">
                                        {formData.description?.length || 0} characters
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. Personal Details (Left Bottom) */}
                        <Card className="xl:col-span-1 bg-[#27272c] border-white/10 shadow-lg h-full">
                            <CardHeader className="bg-white/5 pb-4">
                                <CardTitle className="text-xl text-accent">Personal Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Full Name</label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. Budy Santoso"
                                        className="bg-primary border-white/10 h-12 focus:border-accent text-white"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">CV / Resume</label>
                                    <div className="bg-primary border border-white/10 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                                                    <FiSave size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">Curriculum Vitae</p>
                                                    <p className="text-xs text-white/50">PDF, DOC, DOCX</p>
                                                </div>
                                            </div>
                                            {formData.cvUrl && (
                                                <a
                                                    href={formData.cvUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-accent hover:underline text-xs flex items-center gap-1"
                                                >
                                                    View Current <FiExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                        
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setCvFile(file);
                                                    }
                                                }}
                                                className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-primary hover:file:bg-accent-hover cursor-pointer"
                                            />
                                        </div>
                                        {cvFile && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="mt-3 pt-3 border-t border-white/5"
                                            >
                                                <p className="text-xs text-green-400 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                                    New file selected: {cvFile.name}
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 4. Social Links (Right Bottom) */}
                        <Card className="xl:col-span-2 bg-[#27272c] border-white/10 shadow-lg h-full">
                            <CardHeader className="bg-white/5 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl text-accent">Social Links</CardTitle>
                                    <Button
                                        type="button"
                                        onClick={addSocialLink}
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300 px-4"
                                    >
                                        <FiPlus className="mr-2" /> Add Link
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                {formData.socialLinks.map((link, index) => {
                                    const Icon = socialIcons[link.platform] || FiExternalLink;
                                    return (
                                        <motion.div 
                                            key={index} 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-2 bg-primary p-2 rounded-xl border border-white/5 group hover:border-accent/30 transition-colors"
                                        >
                                            <div className="shrink-0 relative h-10">
                                                <select
                                                    value={link.platform}
                                                    onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                                                    className="h-full w-[115px] bg-[#27272c] border border-white/10 rounded-lg pl-9 pr-2 text-sm text-white focus:outline-none focus:border-accent appearance-none cursor-pointer"
                                                >
                                                    {Object.keys(socialIcons).map(platform => (
                                                        <option key={platform} value={platform}>
                                                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none">
                                                    <Icon size={16} />
                                                </div>
                                            </div>

                                            <div className="flex-1 relative min-w-0">
                                                <Input
                                                    type="url"
                                                    value={link.url}
                                                    onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                                                    placeholder="https://..."
                                                    className="h-10 w-full bg-transparent border-0 focus:ring-0 px-2 text-white placeholder:text-white/20"
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeSocialLink(index)}
                                                className="p-3 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Remove link"
                                            >
                                                <FiX size={18} />
                                            </button>
                                        </motion.div>
                                    );
                                })}
                                {formData.socialLinks.length === 0 && (
                                    <div className="text-center py-6">
                                        <p className="text-white/40 text-sm">No social links added yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <div className="xl:col-span-3 flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                size="lg"
                                className="bg-accent text-primary hover:bg-accent-hover font-bold px-8 h-12 text-lg shadow-lg shadow-accent/20"
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="mr-2 h-5 w-5 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="mr-2 h-5 w-5" />
                                        Save All Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
