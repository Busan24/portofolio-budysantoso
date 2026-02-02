"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.replace("/admin/dashboard");
            } else {
                router.replace("/admin/login");
            }
        }
    }, [user, loading, router]);

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-white/70">Loading...</p>
            </div>
        </div>
    );
}
