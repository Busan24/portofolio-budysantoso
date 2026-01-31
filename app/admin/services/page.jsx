"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiLoader } from "react-icons/fi";
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

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        num: "",
        title: "",
        description: "",
    });

    // Fetch services from Firestore
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const q = query(collection(db, "services"), orderBy("num", "asc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
            showToast.error("Failed to load services");
        } finally {
            setPageLoading(false);
        }
    };

    const handleNew = () => {
        const nextNum = String(services.length + 1).padStart(2, '0');
        setEditingItem(null);
        setFormData({ num: nextNum, title: "", description: "" });
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            num: item.num,
            title: item.title,
            description: item.description,
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
            await deleteDoc(doc(db, "services", deletingItem.id));
            setServices(services.filter(s => s.id !== deletingItem.id));
            showToast.success("Service deleted successfully!");
        } catch (error) {
            console.error("Error deleting:", error);
            showToast.error("Failed to delete service");
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
            const itemData = {
                num: formData.num,
                title: formData.title,
                description: formData.description,
                updatedAt: serverTimestamp(),
            };

            if (editingItem) {
                await updateDoc(doc(db, "services", editingItem.id), itemData);
                setServices(services.map(s =>
                    s.id === editingItem.id ? { ...s, ...itemData } : s
                ));
                showToast.success("Service updated successfully!");
            } else {
                itemData.createdAt = serverTimestamp();
                const docRef = await addDoc(collection(db, "services"), itemData);
                setServices([...services, { id: docRef.id, ...itemData }].sort((a, b) => a.num.localeCompare(b.num)));
                showToast.success("Service added successfully!");
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving:", error);
            showToast.error("Failed to save service");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-primary">
                <AdminHeader title="Services Management" />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="flex flex-col items-center gap-4">
                        <FiLoader className="w-8 h-8 text-accent animate-spin" />
                        <p className="text-white/60">Loading services...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader title="Services Management" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-white/60">Manage your services and skills</p>
                    <Button
                        onClick={handleNew}
                        className="bg-accent hover:bg-accent-hover text-primary font-medium"
                    >
                        <FiPlus className="mr-2" />
                        Add Service
                    </Button>
                </div>

                {/* Services list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#27272c] rounded-xl border border-white/5 p-6 group relative"
                        >
                            {/* Actions */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 bg-accent/10 rounded-lg text-accent hover:bg-accent hover:text-primary transition-colors"
                                >
                                    <FiEdit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(item)}
                                    className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="text-5xl font-extrabold text-transparent mb-4" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}>
                                {item.num}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-white/60 text-sm">{item.description}</p>
                        </motion.div>
                    ))}
                </div>

                {services.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white/40">No services yet. Add your first service!</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-lg">
                <ModalHeader onClose={() => setIsModalOpen(false)}>
                    <ModalTitle>
                        {editingItem ? "Edit Service" : "Add New Service"}
                    </ModalTitle>
                </ModalHeader>

                <form onSubmit={handleSubmit}>
                    <ModalBody className="space-y-5">
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Number</label>
                            <Input
                                type="text"
                                value={formData.num}
                                onChange={(e) => setFormData(prev => ({ ...prev, num: e.target.value }))}
                                placeholder="01"
                                className="bg-white/5 border-white/10 w-24"
                                maxLength={2}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/70 mb-2">Title</label>
                            <Input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Service title"
                                className="bg-white/5 border-white/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/70 mb-2">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe your service..."
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
                title="Delete Service"
                message={`Are you sure you want to delete "${deletingItem?.title}"?`}
                loading={loading}
            />
        </div>
    );
}
