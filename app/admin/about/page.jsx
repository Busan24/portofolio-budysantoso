"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FiSave, FiLoader } from "react-icons/fi";
import { showToast } from "@/components/ui/toast";

// Firebase imports
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const defaultData = {
    bioText: "I am a Software Engineering Technology student at IPB University with a strong passion for web and mobile application development. Experienced in using Java, PHP, JavaScript, Python, Dart, and frameworks such as Laravel, and Flutter, I am eager to apply my skills in real-world projects that support digital transformation. I thrive in collaborative environments, have a solid understanding of database systems like PostgreSQL and MySQL.",
};

export default function AboutPage() {
    const [formData, setFormData] = useState(defaultData);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // Fetch about data from Firestore
    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const docRef = doc(db, "settings", "about");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFormData({ ...defaultData, ...docSnap.data() });
            }
        } catch (error) {
            console.error("Error fetching about data:", error);
        } finally {
            setPageLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const aboutData = {
                bioText: formData.bioText,
                updatedAt: serverTimestamp(),
            };

            await setDoc(doc(db, "settings", "about"), aboutData);
            showToast.success("About section updated successfully!");
        } catch (error) {
            console.error("Error saving about data:", error);
            showToast.error("Failed to save about section");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-primary">
                <AdminHeader title="About Section" />
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
            <AdminHeader title="About Section" />

            <div className="p-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit About Section</CardTitle>
                            <CardDescription>
                                Update your bio and introduction text
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">Bio Text</label>
                                    <Textarea
                                        value={formData.bioText}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bioText: e.target.value }))}
                                        placeholder="Tell visitors about yourself..."
                                        className="bg-white/5 border-white/10 text-white min-h-[200px]"
                                        required
                                    />
                                    <p className="text-xs text-white/40 mt-2">
                                        {formData.bioText.length} characters
                                    </p>
                                </div>

                                {/* Preview */}
                                <div className="p-4 bg-primary rounded-lg border border-white/10">
                                    <h4 className="text-sm font-medium text-white/70 mb-2">Preview:</h4>
                                    <p className="text-white/80 leading-relaxed">{formData.bioText}</p>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-white/10">
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
                                            <>
                                                <FiSave className="mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
