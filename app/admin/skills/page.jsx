"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiCode } from "react-icons/fi";
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

export default function SkillsPage() {
    const [skills, setSkills] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        order: "",
    });

    // Fetch skills from Firestore
    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const q = query(collection(db, "skills"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);
            const skillsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSkills(skillsData);
        } catch (error) {
            console.error("Error fetching skills:", error);
            showToast.error("Failed to load skills");
        } finally {
            setPageLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const skillData = {
                name: formData.name,
                order: parseInt(formData.order) || skills.length + 1,
                updatedAt: serverTimestamp(),
            };

            if (editingItem) {
                // Update existing skill
                await updateDoc(doc(db, "skills", editingItem.id), skillData);
                showToast.success("Skill updated successfully!");
            } else {
                // Add new skill
                skillData.createdAt = serverTimestamp();
                await addDoc(collection(db, "skills"), skillData);
                showToast.success("Skill added successfully!");
            }

            fetchSkills();
            closeModal();
        } catch (error) {
            console.error("Error saving skill:", error);
            showToast.error("Failed to save skill");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingItem) return;

        try {
            await deleteDoc(doc(db, "skills", deletingItem.id));
            showToast.success("Skill deleted successfully!");
            fetchSkills();
        } catch (error) {
            console.error("Error deleting skill:", error);
            showToast.error("Failed to delete skill");
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
                order: item.order?.toString() || "",
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                order: (skills.length + 1).toString(),
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({
            name: "",
            order: "",
        });
    };

    const openDeleteModal = (item) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-primary">
                <AdminHeader title="Skills & Technologies" />
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
            <AdminHeader title="Skills & Technologies" />

            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Manage Skills</h2>
                        <p className="text-white/60 mt-1">Add and manage your technical skills</p>
                    </div>
                    <Button
                        onClick={() => openModal()}
                        className="bg-accent text-primary hover:bg-accent-hover font-bold"
                    >
                        <FiPlus className="mr-2" /> Add Skill
                    </Button>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#27272c] border border-white/10 rounded-xl p-4 hover:border-accent/50 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                                    <FiCode size={20} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(skill)}
                                        className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                                        title="Edit"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(skill)}
                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                        title="Delete"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1">{skill.name}</h3>
                            <p className="text-xs text-white/40">Order: {skill.order}</p>
                        </motion.div>
                    ))}
                </div>

                {skills.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                            <FiCode size={32} className="text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No skills added yet</h3>
                        <p className="text-white/60 mb-6">Start by adding your first skill or technology</p>
                        <Button
                            onClick={() => openModal()}
                            className="bg-accent text-primary hover:bg-accent-hover font-bold"
                        >
                            <FiPlus className="mr-2" /> Add Your First Skill
                        </Button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit}>
                    <ModalHeader>
                        <ModalTitle>{editingItem ? "Edit Skill" : "Add New Skill"}</ModalTitle>
                    </ModalHeader>

                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Skill Name *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. JavaScript, React, Python"
                                    className="bg-primary border-white/10 text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Display Order
                                </label>
                                <Input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                    placeholder="1"
                                    className="bg-primary border-white/10 text-white"
                                    min="1"
                                />
                                <p className="text-xs text-white/40 mt-1">Lower numbers appear first</p>
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
                                <>{editingItem ? "Update" : "Add"} Skill</>
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
                title="Delete Skill"
                message={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}
