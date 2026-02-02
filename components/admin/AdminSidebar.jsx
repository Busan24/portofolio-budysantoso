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

const menuSections = [
    {
        title: "Main",
        items: [
            { name: "Dashboard", href: "/admin/dashboard", icon: FiHome },
        ]
    },
    {
        title: "Content Management",
        items: [
            { name: "Hero", href: "/admin/hero", icon: FiLayout },
            { name: "About", href: "/admin/about", icon: FiUser },
            { name: "Experience", href: "/admin/experience", icon: FiBriefcase },
            { name: "Skills", href: "/admin/skills", icon: FiCode },
            { name: "Services", href: "/admin/services", icon: FiGrid },
            { name: "Tools", href: "/admin/tools", icon: FiTool },
        ]
    },
    {
        title: "Portfolio",
        items: [
            { name: "Projects", href: "/admin/projects", icon: FiFolder },
            { name: "Achievements", href: "/admin/achievements", icon: FiAward },
        ]
    },
    {
        title: "Communication",
        items: [
            { name: "Contact", href: "/admin/contact", icon: FiMail },
        ]
    }
];

const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut, user } = useAuth();
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
        w-72 bg-gradient-to-b from-[#1c1c22] to-[#16161a] border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
        flex flex-col shadow-2xl
      `}>
                {/* Logo & Brand */}
                <div className="h-20 flex items-center justify-center border-b border-white/10 bg-[#1c1c22]/50 backdrop-blur-sm">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300">
                            <FiSettings className="text-accent text-xl group-hover:rotate-90 transition-transform duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-accent">Admin</span>
                            <span className="text-xs font-medium text-white/60">Panel</span>
                        </div>
                    </Link>
                </div>

                {/* User Info Card */}
                {/* {user && (
                    <div className="mx-4 mt-4 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-primary font-bold text-sm">
                                {user.email?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">Admin</p>
                                <p className="text-xs text-white/50 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* Navigation */}
                <nav className="flex-1 py-4 px-4 overflow-y-auto custom-scrollbar">
                    {menuSections.map((section, sectionIndex) => (
                        <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
                            <h3 className="px-3 mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                                {section.title}
                            </h3>
                            <ul className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`
                          group flex items-center gap-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200 relative overflow-hidden
                          ${isActive
                                                        ? 'bg-accent text-primary font-medium shadow-lg shadow-accent/20'
                                                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                                                    }
                        `}
                                            >
                                                {isActive && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                                                )}
                                                <Icon size={18} className={`flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                                                <span className="text-sm">{item.name}</span>
                                                {isActive && (
                                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 space-y-2 border-t border-white/10 bg-[#1c1c22]/50 backdrop-blur-sm">
                    {/* View Site */}
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 group"
                    >
                        <FiExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm">View Portfolio</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        </div>
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group border border-transparent hover:border-red-500/20"
                    >
                        <FiLogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </>
    );
};

export default AdminSidebar;
