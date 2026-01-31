"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
import ImageUpload from "@/components/admin/ImageUpload";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiLoader } from "react-icons/fi";
import { showToast } from "@/components/ui/toast";

// Firebase imports (only Firestore for data, NOT Storage)
import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";

// Cloudinary imports (FREE image hosting!)
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        image: null,
        imagePreview: "",
    });

    // Fetch achievements from Firestore
    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const q = query(collection(db, "achievements"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAchievements(data);
        } catch (error) {
            console.error("Error fetching achievements:", error);
            showToast.error("Failed to load achievements");
        } finally {
            setPageLoading(false);
        }
    };

    // Upload image to Cloudinary (FREE!)
    const uploadImage = async (file) => {
        if (!file) return null;
        try {
            console.log("Uploading to Cloudinary...");
            const result = await uploadToCloudinary(file, 'achievements');
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

    // Delete image from Cloudinary
    const deleteImage = async (publicId) => {
        if (!publicId || publicId.startsWith("/assets")) return;
        try {
            await deleteFromCloudinary(publicId);
            console.log("Image deletion requested:", publicId);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const handleNew = () => {
        setEditingItem(null);
        setFormData({
            title: "",
            subtitle: "",
            description: "",
            image: null,
            imagePreview: "",
        });
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            image: null,
            imagePreview: item.image,
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (item) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, "achievements", deletingItem.id));
            if (deletingItem.imagePublicId) {
                await deleteImage(deletingItem.imagePublicId);
            }
            setAchievements(achievements.filter(a => a.id !== deletingItem.id));
            showToast.success("Achievement deleted successfully!");
        } catch (error) {
            console.error("Error deleting:", error);
            showToast.error("Failed to delete achievement");
        } finally {
            setIsDeleteOpen(false);
            setDeletingItem(null);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.imagePreview;
            let imagePublicId = editingItem?.imagePublicId || null;

            if (formData.image) {
                try {
                    if (editingItem?.imagePublicId) {
                        await deleteImage(editingItem.imagePublicId);
                    }
                    const uploadResult = await uploadImage(formData.image);
                    if (uploadResult) {
                        imageUrl = uploadResult.url;
                        imagePublicId = uploadResult.publicId;
                    }
                } catch (uploadError) {
                    console.error("Upload error:", uploadError);
                    showToast.error(`Failed to upload image: ${uploadError.message}`);
                    setLoading(false);
                    return; // Stop the submission if upload fails
                }
            }

            // Validate required fields
            if (!formData.title || !formData.subtitle) {
                showToast.error("Title and subtitle are required");
                setLoading(false);
                return;
            }

            const itemData = {
                title: formData.title,
                subtitle: formData.subtitle,
                description: formData.description,
                image: imageUrl || "/assets/placeholder.png",
                imagePublicId: imagePublicId, // Cloudinary public ID
                updatedAt: serverTimestamp(),
            };

            if (editingItem) {
                await updateDoc(doc(db, "achievements", editingItem.id), itemData);
                setAchievements(achievements.map(a =>
                    a.id === editingItem.id ? { ...a, ...itemData } : a
                ));
                showToast.success("Achievement updated successfully!");
            } else {
                itemData.createdAt = serverTimestamp();
                const docRef = await addDoc(collection(db, "achievements"), itemData);
                setAchievements([{ id: docRef.id, ...itemData }, ...achievements]);
                showToast.success("Achievement added successfully!");
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving:", error);
            showToast.error("Failed to save achievement");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-primary">
                <AdminHeader title="Achievements Management" />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="flex flex-col items-center gap-4">
                        <FiLoader className="w-8 h-8 text-accent animate-spin" />
                        <p className="text-white/60">Loading achievements...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader title="Achievements Management" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-white/60">Manage your awards and recognitions</p>
                    <Button
                        onClick={handleNew}
                        className="bg-accent hover:bg-accent-hover text-primary font-medium"
                    >
                        <FiPlus className="mr-2" />
                        Add Achievement
                    </Button>
                </div>

                {/* Achievements list */}
                <div className="space-y-4">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#27272c] rounded-xl border border-white/5 p-4 flex flex-col md:flex-row gap-4 group"
                        >
                            {/* Image */}
                            <div className="w-full md:w-32 h-32 flex-shrink-0 relative rounded-lg overflow-hidden bg-primary">
                                <Image
                                    src={item.image || "/assets/placeholder.png"}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                <p className="text-accent text-sm mb-2">{item.subtitle}</p>
                                <p className="text-white/60 text-sm line-clamp-2">{item.description}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 bg-accent/10 rounded-lg text-accent hover:bg-accent hover:text-primary transition-colors"
                                >
                                    <FiEdit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(item)}
                                    className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {achievements.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white/40">No achievements yet. Add your first achievement!</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-lg">
                <ModalHeader onClose={() => setIsModalOpen(false)}>
                    <ModalTitle>
                        {editingItem ? "Edit Achievement" : "Add New Achievement"}
                    </ModalTitle>
                </ModalHeader>

                <form onSubmit={handleSubmit}>
                    <ModalBody className="space-y-5">
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Image</label>
                            <ImageUpload
                                value={formData.imagePreview}
                                onChange={(file) => {
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData(prev => ({ ...prev, image: file, imagePreview: reader.result }));
                                        };
                                        reader.readAsDataURL(file);
                                    } else {
                                        setFormData(prev => ({ ...prev, image: null, imagePreview: "" }));
                                    }
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/70 mb-2">Title</label>
                            <Input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Achievement title"
                                className="bg-white/5 border-white/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/70 mb-2">Subtitle (Organizer & Year)</label>
                            <Input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                                placeholder="By Organization Name - Year"
                                className="bg-white/5 border-white/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/70 mb-2">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe your achievement..."
                                className="bg-white/5 border-white/10 min-h-[100px]"
                                required
                            />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="hover:bg-white/5">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-primary">
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                editingItem ? "Update" : "Add"
                            )}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>

            <DeleteConfirm
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Achievement"
                message={`Are you sure you want to delete "${deletingItem?.title}"?`}
                loading={loading}
            />
        </div>
    );
}
