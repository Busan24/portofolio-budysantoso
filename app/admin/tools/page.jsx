"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiTool, FiImage } from "react-icons/fi";
import { showToast } from "@/components/ui/toast";

// Firebase imports
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

// Cloudinary imports
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export default function ToolsPage() {
    const [tools, setTools] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        icon: "",
        iconFile: null,
    });

    // Fetch tools from Firestore
    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            const q = query(collection(db, "tools"), orderBy("name", "asc"));
            const querySnapshot = await getDocs(q);
            const toolsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTools(toolsData);
        } catch (error) {
            console.error("Error fetching tools:", error);
            showToast.error("Failed to load tools");
        } finally {
            setPageLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let iconUrl = formData.icon;

            // Upload icon to Cloudinary if new file selected
            if (formData.iconFile) {
                try {
                    const uploadResult = await uploadToCloudinary(formData.iconFile, 'tools');
                    iconUrl = uploadResult.url;
                } catch (error) {
                    console.error("Error uploading icon:", error);
                    showToast.error("Failed to upload icon");
                    setLoading(false);
                    return;
                }
            }

            const toolData = {
                name: formData.name,
                logo: iconUrl,
                updatedAt: serverTimestamp(),
            };

            if (editingItem) {
                // Update existing tool
                await updateDoc(doc(db, "tools", editingItem.id), toolData);
                showToast.success("Tool updated successfully!");
            } else {
                // Add new tool
                toolData.createdAt = serverTimestamp();
                await addDoc(collection(db, "tools"), toolData);
                showToast.success("Tool added successfully!");
            }

            fetchTools();
            closeModal();
        } catch (error) {
            console.error("Error saving tool:", error);
            showToast.error("Failed to save tool");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingItem) return;

        try {
            // Delete icon from Cloudinary if it exists and not from assets
            if (deletingItem.logo && !deletingItem.logo.includes('/assets/')) {
                try {
                    // Extract public_id from Cloudinary URL
                    const publicIdMatch = deletingItem.logo.match(/\/tools\/([^/]+)\./);
                    if (publicIdMatch) {
                        await deleteFromCloudinary(`tools/${publicIdMatch[1]}`);
                    }
                } catch (error) {
                    console.error("Error deleting icon:", error);
                }
            }

            await deleteDoc(doc(db, "tools", deletingItem.id));
            showToast.success("Tool deleted successfully!");
            fetchTools();
        } catch (error) {
            console.error("Error deleting tool:", error);
            showToast.error("Failed to delete tool");
        } finally {
            setIsDeleteOpen(false);
            setDeletingItem(null);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name || "",
                icon: item.logo || "",
                iconFile: null,
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                icon: "",
                iconFile: null,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({
            name: "",
            icon: "",
            iconFile: null,
        });
    };

    const openDeleteModal = (item) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-primary">
                <AdminHeader title="Tools & Technologies for Projects" />
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
            <AdminHeader title="Tools & Technologies for Projects" />

            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Manage Project Tools</h2>
                        <p className="text-white/60 mt-1">Add custom tools for your projects (separate from Skills)</p>
                    </div>
                    <Button
                        onClick={() => openModal()}
                        className="bg-accent text-primary hover:bg-accent-hover font-bold"
                    >
                        <FiPlus className="mr-2" /> Add Tool
                    </Button>
                </div>

                {/* Info Box */}
                {/* <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <FiTool className="text-blue-400 mt-1" size={20} />
                        <div className="flex-1">
                            <h3 className="text-blue-400 font-semibold mb-1">About Project Tools</h3>
                            <p className="text-white/70 text-sm">
                                Tools added here will appear in the project form alongside the default tools from the assets folder. 
                                This allows you to add new technologies that you might use in future projects without modifying code.
                            </p>
                        </div>
                    </div>
                </div> */}

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#27272c] border border-white/10 rounded-xl p-4 hover:border-accent/50 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                {tool.logo ? (
                                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden p-1">
                                        <Image src={tool.logo} alt={tool.name} width={48} height={48} className="object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                                        <FiTool size={24} />
                                    </div>
                                )}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(tool)}
                                        className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                                        title="Edit"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(tool)}
                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                        title="Delete"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1">{tool.name}</h3>
                            <p className="text-xs text-white/40">Custom Tool</p>
                        </motion.div>
                    ))}
                </div>

                {tools.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                            <FiTool size={32} className="text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No custom tools added yet</h3>
                        <p className="text-white/60 mb-6">Add your first custom tool for projects</p>
                        <Button
                            onClick={() => openModal()}
                            className="bg-accent text-primary hover:bg-accent-hover font-bold"
                        >
                            <FiPlus className="mr-2" /> Add Your First Tool
                        </Button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{editingItem ? "Edit Tool" : "Add New Tool"}</ModalTitle>
                    </ModalHeader>

                    <ModalBody>
                        <div className="space-y-4">
                            {/* Icon Upload */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Tool Icon *
                                </label>
                                <div className="flex items-center gap-4">
                                    {/* Icon Preview */}
                                    <div className="w-20 h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-2">
                                        {formData.icon ? (
                                            <Image src={formData.icon} alt="Icon preview" width={60} height={60} className="object-contain" />
                                        ) : (
                                            <FiImage size={32} className="text-white/20" />
                                        )}
                                    </div>
                                    {/* Upload Button */}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData(prev => ({ 
                                                            ...prev, 
                                                            icon: reader.result,
                                                            iconFile: file 
                                                        }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-accent-hover cursor-pointer"
                                            required={!editingItem}
                                        />
                                        <p className="text-xs text-white/40 mt-1">PNG, SVG, JPG (max 2MB, square recommended)</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Tool Name *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Docker, Redis, GraphQL"
                                    className="bg-primary border-white/10 text-white"
                                    required
                                />
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            type="button"
                            onClick={closeModal}
                            variant="outline"
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-primary hover:bg-accent-hover font-bold"
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>{editingItem ? "Update" : "Add"} Tool</>
                            )}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <DeleteConfirm
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setDeletingItem(null);
                }}
                onConfirm={handleDelete}
                title="Delete Tool"
                message={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}
