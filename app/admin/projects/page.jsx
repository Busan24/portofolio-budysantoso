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
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiSearch,
    FiX,
    FiFilter,
    FiLoader
} from "react-icons/fi";
import { showToast } from "@/components/ui/toast";

// Firebase imports (only Firestore, NOT Storage)
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
import { uploadToCloudinary, deleteFromCloudinary, getOptimizedImageUrl } from "@/lib/cloudinary";

// Categories for projects
const categories = ["Website", "Mobile App", "UI/UX Design"];

// Default/Hardcoded tools from assets folder
const defaultTools = [
    { name: "Android", logo: "/assets/logo/android-logo.png" },
    { name: "Java", logo: "/assets/logo/java-logo.png" },
    { name: "Firebase", logo: "/assets/logo/firebase-logo.png" },
    { name: "Laravel", logo: "/assets/logo/laravel-logo.png" },
    { name: "PHP", logo: "/assets/logo/php-logo.png" },
    { name: "TailwindCSS", logo: "/assets/logo/tailwind-logo.png" },
    { name: "JavaScript", logo: "/assets/logo/javascript-logo.png" },
    { name: "NextJs", logo: "/assets/logo/nextjs-logo.png" },
    { name: "Python", logo: "/assets/logo/python-logo.png" },
    { name: "Unity", logo: "/assets/logo/unity-logo.png" },
    { name: "Figma", logo: "/assets/logo/figma-logo.png" },
    { name: "BootStrap", logo: "/assets/logo/bootstrap-logo.png" },
    { name: "MongoDB", logo: "/assets/logo/mongo-logo.png" },
    { name: "MySql", logo: "/assets/logo/mysql-logo.png" },
    { name: "PostgreSql", logo: "/assets/logo/postgresql-logo.png" },
    { name: "TensorFlow", logo: "/assets/logo/tensorflow-logo.png" },
    { name: "HTML", logo: "/assets/logo/html-logo.png" },
    { name: "CSS", logo: "/assets/logo/css-logo.png" },
    { name: "SpringBoot", logo: "/assets/logo/spring-boot-logo.png" },
    { name: "Blender", logo: "/assets/logo/blender-logo.png" },
    { name: "Fuvoria", logo: "/assets/logo/fuvoria-logo.png" },
];

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [availableTools, setAvailableTools] = useState(defaultTools);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deletingProject, setDeletingProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        category: "Website",
        description: "",
        image: null,
        imagePreview: "",
        tools: [],
        features: [""],
    });

    // Fetch projects and tools from Firestore
    useEffect(() => {
        fetchProjects();
        fetchCustomTools();
    }, []);

    const fetchCustomTools = async () => {
        try {
            const q = query(collection(db, "tools"), orderBy("name", "asc"));
            const snapshot = await getDocs(q);
            const customTools = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                logo: doc.data().logo
            }));
            
            // Combine default tools + custom tools
            const allTools = [...defaultTools, ...customTools];
            setAvailableTools(allTools);
        } catch (error) {
            console.error("Error fetching custom tools:", error);
            // Keep using default tools if error
            setAvailableTools(defaultTools);
        }
    };

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
        } catch (error) {
            console.error("Error fetching projects:", error);
            showToast.error("Failed to load projects");
        } finally {
            setPageLoading(false);
        }
    };

    // Upload image to Cloudinary (FREE!)
    const uploadImage = async (file) => {
        if (!file) return null;
        try {
            console.log("Uploading to Cloudinary...");
            const result = await uploadToCloudinary(file, 'projects');
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

    // Filter projects
    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "All" || project.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Open modal for new project
    const handleNewProject = () => {
        setEditingProject(null);
        setFormData({
            title: "",
            category: "Website",
            description: "",
            image: null,
            imagePreview: "",
            tools: [],
            features: [""],
        });
        setIsModalOpen(true);
    };

    // Open modal for editing
    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            category: project.category,
            description: project.description,
            image: null,
            imagePreview: project.image,
            tools: project.tools?.map(t => t.name) || [],
            features: project.features?.length > 0 ? project.features : [""],
        });
        setIsModalOpen(true);
    };

    // Handle delete click
    const handleDeleteClick = (project) => {
        setDeletingProject(project);
        setIsDeleteOpen(true);
    };

    // Confirm delete
    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            // Delete from Firestore
            await deleteDoc(doc(db, "projects", deletingProject.id));

            // Delete image from storage if exists
            if (deletingProject.imagePublicId) {
                await deleteImage(deletingProject.imagePublicId);
            }

            setProjects(projects.filter(p => p.id !== deletingProject.id));
            showToast.success("Project deleted successfully!");
        } catch (error) {
            console.error("Error deleting project:", error);
            showToast.error("Failed to delete project");
        } finally {
            setIsDeleteOpen(false);
            setDeletingProject(null);
            setLoading(false);
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Map tool names to tool objects
            const toolObjects = formData.tools.map(toolName =>
                availableTools.find(t => t.name === toolName)
            ).filter(Boolean);

            let imageUrl = formData.imagePreview;
            let imagePublicId = editingProject?.imagePublicId || null;

            // Upload new image if provided
            if (formData.image) {
                // Delete old image if updating
                if (editingProject?.imagePublicId) {
                    await deleteImage(editingProject.imagePublicId);
                }

                const uploadResult = await uploadImage(formData.image);
                if (uploadResult) {
                    imageUrl = uploadResult.url;
                    imagePublicId = uploadResult.publicId;
                }
            }

            const projectData = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                image: imageUrl || "/assets/placeholder.png",
                imagePublicId: imagePublicId,
                tools: toolObjects,
                features: formData.features.filter(f => f.trim() !== ""),
                updatedAt: serverTimestamp(),
            };

            if (editingProject) {
                // Update existing project
                await updateDoc(doc(db, "projects", editingProject.id), projectData);
                setProjects(projects.map(p =>
                    p.id === editingProject.id ? { ...p, ...projectData } : p
                ));
                showToast.success("Project updated successfully!");
            } else {
                // Add new project
                projectData.createdAt = serverTimestamp();
                const docRef = await addDoc(collection(db, "projects"), projectData);
                setProjects([{ id: docRef.id, ...projectData }, ...projects]);
                showToast.success("Project added successfully!");
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving project:", error);
            showToast.error("Failed to save project. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    // Toggle tool selection
    const toggleTool = (toolName) => {
        setFormData(prev => ({
            ...prev,
            tools: prev.tools.includes(toolName)
                ? prev.tools.filter(t => t !== toolName)
                : [...prev.tools, toolName]
        }));
    };

    // Add feature input
    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, ""]
        }));
    };

    // Remove feature input
    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    // Update feature value
    const updateFeature = (index, value) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((f, i) => i === index ? value : f)
        }));
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-primary">
                <AdminHeader title="Projects Management" />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="flex flex-col items-center gap-4">
                        <FiLoader className="w-8 h-8 text-accent animate-spin" />
                        <p className="text-white/60">Loading projects...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader title="Projects Management" />

            <div className="p-6">
                {/* Header actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <Input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-[#27272c] border-white/10"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-2">
                            <FiFilter className="text-white/40" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="bg-[#27272c] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                                style={{
                                    colorScheme: 'dark'
                                }}
                            >
                                <option value="All" className="bg-[#27272c] text-white py-2">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-[#27272c] text-white py-2">{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Button
                        onClick={handleNewProject}
                        className="bg-accent hover:bg-accent-hover text-primary font-medium"
                    >
                        <FiPlus className="mr-2" />
                        Add Project
                    </Button>
                </div>

                {/* Projects grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#27272c] rounded-xl border border-white/5 overflow-hidden group"
                        >
                            {/* Image */}
                            <div className="relative h-40 bg-primary">
                                <Image
                                    src={project.imagePublicId ? getOptimizedImageUrl(project.imagePublicId, 500, 300) : "/assets/placeholder.png"}
                                    alt={project.title}
                                    fill
                                    className="object-contain"
                                />
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="p-2 bg-accent rounded-lg text-primary hover:bg-accent-hover transition-colors"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(project)}
                                        className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded-md">
                                        {project.category}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-white mb-2">{project.title}</h3>
                                <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>

                                {/* Tools */}
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {project.tools?.slice(0, 4).map((tool, i) => (
                                        <div
                                            key={i}
                                            className="w-6 h-6 rounded-full overflow-hidden bg-white/5"
                                            title={tool.name}
                                        >
                                            <Image
                                                src={tool.logo}
                                                alt={tool.name}
                                                width={24}
                                                height={24}
                                                className="object-contain"
                                            />
                                        </div>
                                    ))}
                                    {project.tools?.length > 4 && (
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                                            +{project.tools.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white/40">No projects found. Add your first project!</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl">
                <ModalHeader onClose={() => setIsModalOpen(false)}>
                    <ModalTitle>
                        {editingProject ? "Edit Project" : "Add New Project"}
                    </ModalTitle>
                </ModalHeader>

                <form onSubmit={handleSubmit}>
                    <ModalBody className="space-y-5 max-h-[60vh] overflow-y-auto">
                        {/* Image upload */}
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Project Image</label>
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

                        {/* Title */}
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Title</label>
                            <Input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Project title"
                                className="bg-white/5 border-white/10"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full bg-[#27272c] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
                                style={{
                                    colorScheme: 'dark'
                                }}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-[#27272c] text-white py-2">{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Project description..."
                                className="bg-white/5 border-white/10 min-h-[120px]"
                                required
                            />
                        </div>

                        {/* Tools */}
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Tools & Technologies</label>
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-lg border border-white/10">
                                {availableTools.map((tool) => (
                                    <button
                                        key={tool.name}
                                        type="button"
                                        onClick={() => toggleTool(tool.name)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm ${formData.tools.includes(tool.name)
                                                ? "bg-accent text-primary border-accent"
                                                : "bg-white/5 text-white/70 border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        <Image src={tool.logo} alt={tool.name} width={16} height={16} className="rounded" />
                                        {tool.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Features</label>
                            <div className="space-y-2">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                            placeholder={`Feature ${index + 1}`}
                                            className="bg-white/5 border-white/10 flex-1"
                                        />
                                        {formData.features.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <FiX size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
                                >
                                    <FiPlus size={14} />
                                    Add Feature
                                </button>
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                            className="hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-accent hover:bg-accent-hover text-primary"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                editingProject ? "Update Project" : "Add Project"
                            )}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>

            {/* Delete confirmation */}
            <DeleteConfirm
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Project"
                message={`Are you sure you want to delete "${deletingProject?.title}"? This action cannot be undone.`}
                loading={loading}
            />
        </div>
    );
}
