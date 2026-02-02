"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Wait for auth to finish loading
        if (loading) {
            return;
        }

        // If no user and not on login page, redirect to login
        if (!user && pathname !== "/admin/login") {
            console.log("No user found, redirecting to login...");
            router.replace("/admin/login");
            return;
        }

        // User is authenticated
        setIsChecking(false);
    }, [user, loading, router, pathname]);

    // Show loading state while checking auth
    if (loading || isChecking) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/70">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if user is not authenticated
    if (!user) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/70">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
