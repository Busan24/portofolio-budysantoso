"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FiSave, FiPhone, FiMail, FiLoader } from "react-icons/fi";
import { showToast } from "@/components/ui/toast";

// Firebase imports
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const defaultData = {
    phone: "+62 895 3392 00924",
    email: "budysantoso1120@gmail.com",
};

export default function ContactPage() {
    const [formData, setFormData] = useState(defaultData);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // Fetch contact data from Firestore
    useEffect(() => {
        fetchContactData();
    }, []);

    const fetchContactData = async () => {
        try {
            const docRef = doc(db, "settings", "contact");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFormData({ ...defaultData, ...docSnap.data() });
            }
        } catch (error) {
            console.error("Error fetching contact data:", error);
        } finally {
            setPageLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const contactData = {
                phone: formData.phone,
                email: formData.email,
                updatedAt: serverTimestamp(),
            };

            await setDoc(doc(db, "settings", "contact"), contactData);
            showToast.success("Contact information updated successfully!");
        } catch (error) {
            console.error("Error saving contact data:", error);
            showToast.error("Failed to save contact information");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-primary">
                <AdminHeader title="Contact Information" />
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
            <AdminHeader title="Contact Information" />

            <div className="p-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Contact Information</CardTitle>
                            <CardDescription>
                                Update your contact details displayed on the portfolio
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                        <Input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="+62 xxx xxxx xxxx"
                                            className="bg-white/5 border-white/10 pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/70 mb-2">Email Address</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="your@email.com"
                                            className="bg-white/5 border-white/10 pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="p-4 bg-primary rounded-lg border border-white/10">
                                    <h4 className="text-sm font-medium text-white/70 mb-4">Preview:</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#27272c] rounded-md flex items-center justify-center">
                                                <FiPhone className="text-accent" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-sm">Phone</p>
                                                <p className="text-white">{formData.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#27272c] rounded-md flex items-center justify-center">
                                                <FiMail className="text-accent" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-sm">Email</p>
                                                <p className="text-white">{formData.email}</p>
                                            </div>
                                        </div>
                                    </div>
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
