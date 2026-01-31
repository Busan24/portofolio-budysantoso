"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
    FiHome,
    FiUser,
    FiGrid,
    FiFolder,
    FiAward,
    FiMail,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX,
    FiExternalLink,
    FiLayout,
    FiBriefcase,
    FiCode,
    FiTool
} from "react-icons/fi";

const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: FiHome },
    { name: "Hero", href: "/admin/hero", icon: FiLayout },
    { name: "About", href: "/admin/about", icon: FiUser },
    { name: "Experience", href: "/admin/experience", icon: FiBriefcase },
    { name: "Skills", href: "/admin/skills", icon: FiCode },
    { name: "Services", href: "/admin/services", icon: FiGrid },
    { name: "Tools", href: "/admin/tools", icon: FiTool },
    { name: "Projects", href: "/admin/projects", icon: FiFolder },
    { name: "Achievements", href: "/admin/achievements", icon: FiAward },
    { name: "Contact", href: "/admin/contact", icon: FiMail },
];

const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        router.push("/admin/login");
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="xl:hidden fixed top-4 left-4 z-50 p-2 bg-[#27272c] rounded-lg text-white hover:bg-accent transition-colors"
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="xl:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed xl:static inset-y-0 left-0 z-40
        w-64 bg-[#1c1c22] border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
        flex flex-col
      `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-white/10">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <span className="text-xl font-bold text-accent">Admin</span>
                        <span className="text-xl font-bold text-white">Panel</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${isActive
                                                ? 'bg-accent text-primary font-medium'
                                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                                            }
                    `}
                                    >
                                        <Icon size={20} />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Divider */}
                    <div className="my-6 border-t border-white/10" />

                    {/* Extra links */}
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/"
                                target="_blank"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200"
                            >
                                <FiExternalLink size={20} />
                                <span>View Site</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Logout button */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <FiLogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
