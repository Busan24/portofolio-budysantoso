"use client";

import { useAuth } from "@/context/AuthContext";
import { FiBell, FiUser } from "react-icons/fi";

const AdminHeader = ({ title }) => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-[#1c1c22] border-b border-white/10 flex items-center justify-between px-6">
            {/* Page title */}
            <div className="xl:ml-0 ml-12">
                <h1 className="text-xl font-semibold text-white">{title}</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notification bell */}
                {/* <button className="p-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all">
                    <FiBell size={20} />
                </button> */}

                {/* User info */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <FiUser size={16} className="text-primary" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-white">
                            {user?.displayName || user?.email?.split("@")[0] || "Admin"}
                        </p>
                        <p className="text-xs text-white/50">{user?.email}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
