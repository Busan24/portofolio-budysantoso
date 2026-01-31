"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiBriefcase, FiMapPin, FiCalendar, FiMaximize2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DeleteConfirm from "@/components/admin/DeleteConfirm";

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const q = query(collection(db, "experiences"), orderBy("startDate", "desc"));
      const snapshot = await getDocs(q);
      const experiencesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExperiences(experiencesData);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, "experiences", editingId), {
          ...formData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, "experiences"), {
          ...formData,
          createdAt: new Date()
        });
      }
      
      resetForm();
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  const handleEdit = (experience) => {
    setFormData({
      title: experience.title,
      company: experience.company,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
    });
    setEditingId(experience.id);
    setIsFormOpen(true);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "experiences", deleteId));
      fetchExperiences();
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
    setIsFormOpen(false);
    setErrors({});
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-lg">
              <FiBriefcase className="text-accent text-2xl" />
            </div>
            Experience Management
          </h1>
          <p className="text-white/60 mt-2 ml-1">Manage your professional journey and career history</p>
        </div>
        {!isFormOpen && (
          <Button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="bg-accent hover:bg-accent/90 text-primary font-bold px-6 h-12 shadow-lg shadow-accent/20 transition-all hover:scale-105"
          >
            <FiPlus size={20} className="mr-2" />
            Add New Experience
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-[#27272c] border-accent/20 shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 pb-4 bg-white/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    {editingId ? <FiEdit2 className="text-accent" /> : <FiPlus className="text-accent" />}
                    {editingId ? "Edit Experience" : "Add New Experience"}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={resetForm}
                    size="icon"
                    className="hover:bg-red-500/10 hover:text-red-500 text-white/50"
                  >
                    <FiX size={24} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <FiBriefcase className="text-accent" /> Job Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className={`w-full h-[52px] bg-[#1c1c22] border-white/10 text-white focus:border-accent text-lg ${
                        errors.title ? "border-red-500/50 focus:border-red-500" : ""
                      }`}
                    />
                    {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
                  </div>

                  {/* Company & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <FiMaximize2 className="text-accent" /> Company <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Google Inc."
                        className={`w-full h-[52px] bg-[#1c1c22] border-white/10 text-white focus:border-accent ${
                          errors.company ? "border-red-500/50 focus:border-red-500" : ""
                        }`}
                      />
                      {errors.company && <p className="text-red-400 text-sm">{errors.company}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <FiMapPin className="text-accent" /> Location <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Mountain View, CA"
                        className={`w-full h-[52px] bg-[#1c1c22] border-white/10 text-white focus:border-accent ${
                          errors.location ? "border-red-500/50 focus:border-red-500" : ""
                        }`}
                      />
                      {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <FiCalendar className="text-accent" /> Start Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        placeholder="e.g. Jan 2022"
                        className={`w-full h-[52px] bg-[#1c1c22] border-white/10 text-white focus:border-accent ${
                          errors.startDate ? "border-red-500/50 focus:border-red-500" : ""
                        }`}
                      />
                      {errors.startDate && <p className="text-red-400 text-sm">{errors.startDate}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <FiCalendar className="text-accent" /> End Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        placeholder="e.g. Present"
                        className={`w-full h-[52px] bg-[#1c1c22] border-white/10 text-white focus:border-accent ${
                          errors.endDate ? "border-red-500/50 focus:border-red-500" : ""
                        }`}
                      />
                      {errors.endDate && <p className="text-red-400 text-sm">{errors.endDate}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-white/5">
                    <Button
                      type="button"
                      onClick={resetForm}
                      variant="outline"
                      className="min-w-[120px] h-[50px] border-white/10 hover:bg-white/5 hover:text-white transition-all bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="min-w-[160px] bg-accent hover:bg-accent/90 text-primary font-bold h-[50px] text-base shadow-lg shadow-accent/20 transition-all hover:scale-105"
                    >
                      <FiSave className="mr-2" size={18} />
                      {editingId ? "Update Experience" : "Save Experience"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-accent rounded-full inline-block"></span>
        Experience History
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-[#27272c] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-16 bg-[#27272c] rounded-xl border border-white/5 border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
            <FiBriefcase size={40} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Experiences Yet</h3>
          <p className="text-white/50 mb-6 max-w-sm mx-auto">Start building your portfolio by adding your professional work experience.</p>
          <Button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-primary"
          >
            <FiPlus className="mr-2" />
            Add Experience
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#27272c] border-transparent hover:border-accent/40 transition-all duration-300 group hover:shadow-lg hover:shadow-accent/5 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider rounded-full">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors">
                        {exp.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-white/60 text-sm">
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-md">
                          <FiMaximize2 className="text-accent" />
                          {exp.company}
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-md">
                          <FiMapPin className="text-accent" />
                          {exp.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                      <Button
                        onClick={() => handleEdit(exp)}
                        className="flex-1 md:flex-none bg-white/5 hover:bg-accent hover:text-primary text-white transition-all h-10 px-4"
                      >
                        <FiEdit2 className="mr-2" /> Edit
                      </Button>
                      <Button
                        onClick={() => setDeleteId(exp.id)}
                        className="flex-1 md:flex-none bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all h-10 px-4"
                      >
                        <FiTrash2 className="mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {deleteId && (
        <DeleteConfirm
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Experience"
          message="Are you sure you want to remove this experience record?"
        />
      )}
    </div>
  );
};

export default ExperiencePage;
