"use client";

import { AuthProvider } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { ToastProvider } from "@/components/ui/toast";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    // Login page is completely isolated - no sidebar, no header, no wrapper
    if (isLoginPage) {
        return (
            <AuthProvider>
                <ToastProvider />
                <div className="w-full h-full">
                    {children}
                </div>
            </AuthProvider>
        );
    }

    return (
        <AuthProvider>
            <ProtectedRoute>
                <ToastProvider />
                <div className="min-h-screen bg-primary flex">
                    {/* Sidebar */}
                    <AdminSidebar />

                    {/* Main content */}
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
}
