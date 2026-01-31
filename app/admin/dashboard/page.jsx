"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    FiFolder,
    FiAward,
    FiGrid,
    FiMail,
    FiPlus,
    FiEdit3,
    FiExternalLink,
    FiTrendingUp,
    FiUser
} from "react-icons/fi";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Quick actions
const quickActions = [
    { title: "Add Project", icon: FiPlus, href: "/admin/projects?action=new", color: "bg-accent" },
    { title: "Edit Hero", icon: FiEdit3, href: "/admin/hero", color: "bg-[#27272c]" },
    { title: "View Site", icon: FiExternalLink, href: "/", target: "_blank", color: "bg-[#27272c]" },
];

export default function DashboardPage() {
    const { user } = useAuth();
    const userName = user?.displayName || user?.email?.split("@")[0] || "Admin";

    const [stats, setStats] = useState({
        projects: 0,
        achievements: 0,
        services: 0,
        aboutSections: 0,
        loading: true
    });

    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch counts from all collections in parallel
                const [projectsSnap, achievementsSnap, servicesSnap, aboutSnap] = await Promise.all([
                    getDocs(collection(db, "projects")),
                    getDocs(collection(db, "achievements")),
                    getDocs(collection(db, "services")),
                    getDocs(collection(db, "about"))
                ]);

                setStats({
                    projects: projectsSnap.size,
                    achievements: achievementsSnap.size,
                    services: servicesSnap.size,
                    aboutSections: aboutSnap.size,
                    loading: false
                });

                // Build recent activity from the collections (last updated items)
                const activities = [];
                
                if (projectsSnap.size > 0) {
                    activities.push({
                        action: `${projectsSnap.size} Projects available`,
                        time: "Active",
                        icon: FiFolder
                    });
                }
                
                if (achievementsSnap.size > 0) {
                    activities.push({
                        action: `${achievementsSnap.size} Achievements added`,
                        time: "Active",
                        icon: FiAward
                    });
                }

                if (servicesSnap.size > 0) {
                    activities.push({
                        action: `${servicesSnap.size} Services configured`,
                        time: "Active",
                        icon: FiGrid
                    });
                }

                if (aboutSnap.size > 0) {
                    activities.push({
                        action: `${aboutSnap.size} About sections created`,
                        time: "Active",
                        icon: FiUser
                    });
                }

                setRecentActivity(activities.length > 0 ? activities : [
                    { action: "Dashboard initialized", time: "Just now", icon: FiTrendingUp }
                ]);

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    // Dynamic stats cards
    const statsCards = [
        {
            title: "Projects",
            count: stats.projects,
            icon: FiFolder,
            color: "bg-blue-500/10 text-blue-400",
            href: "/admin/projects"
        },
        {
            title: "Achievements",
            count: stats.achievements,
            icon: FiAward,
            color: "bg-yellow-500/10 text-yellow-400",
            href: "/admin/achievements"
        },
        {
            title: "Services",
            count: stats.services,
            icon: FiGrid,
            color: "bg-green-500/10 text-green-400",
            href: "/admin/services"
        },
        {
            title: "About Sections",
            count: stats.aboutSections,
            icon: FiUser,
            color: "bg-purple-500/10 text-purple-400",
            href: "/admin/about"
        },
    ];

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader title="Dashboard" />

            <div className="p-6">

                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={stat.href}
                                className="block bg-[#27272c] rounded-xl p-5 border border-white/5 hover:border-accent/30 transition-all duration-200 group relative overflow-hidden"
                            >
                                {stats.loading && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
                                         style={{ backgroundSize: '200% 100%' }} 
                                    />
                                )}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/60 text-sm">{stat.title}</p>
                                        <p className="text-3xl font-bold text-white mt-1">
                                            {stats.loading ? (
                                                <span className="inline-block w-12 h-8 bg-white/5 rounded animate-pulse" />
                                            ) : (
                                                stat.count
                                            )}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
                                        <stat.icon size={24} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Quick actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                href={action.href}
                                target={action.target}
                                className={`${action.color} px-5 py-3 rounded-lg flex items-center gap-2 text-white font-medium hover:opacity-90 transition-opacity border border-white/5`}
                            >
                                <action.icon size={18} />
                                <span>{action.title}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Recent activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="bg-[#27272c] rounded-xl border border-white/5 overflow-hidden">
                        {recentActivity.length > 0 ? (
                            <ul className="divide-y divide-white/5">
                                {recentActivity.map((item, index) => (
                                    <li key={index} className="p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <item.icon size={16} className="text-white/60" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm">{item.action}</p>
                                            <p className="text-white/40 text-xs">{item.time}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-white/40">No recent activity</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
