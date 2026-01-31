"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiShield, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        const result = await signIn(email, password);

        if (result.success) {
            router.push("/admin/dashboard");
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-[#1a1a1f] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ 
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/3 rounded-full blur-3xl" 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
            </div>

            {/* Back to Portfolio Button */}
            <Link 
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-white/60 hover:text-accent transition-colors group z-10"
            >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Portfolio</span>
            </Link>

            {/* Login card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full max-w-[440px] z-10"
            >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/5 rounded-3xl blur-xl" />
                
                <div className="relative bg-[#1c1c21]/95 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-2xl">
                    {/* Header with icon */}
                    <div className="text-center mb-8">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-accent/20"
                        >
                            <FiShield className="w-10 h-10 text-accent" />
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-white mb-2"
                        >
                            Admin Login
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/50 text-sm"
                        >
                            Sign in to manage your portfolio
                        </motion.p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start gap-3"
                        >
                            <FiAlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-red-400 text-sm leading-relaxed">{error}</p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-2.5"
                        >
                            <label htmlFor="email" className="block text-sm font-medium text-white/80 pl-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-all duration-300 pointer-events-none">
                                    <FiMail size={19} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="w-full h-[52px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:bg-white/10 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-2.5"
                        >
                            <label htmlFor="password" className="block text-sm font-medium text-white/80 pl-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-all duration-300 pointer-events-none">
                                    <FiLock size={19} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full h-[52px] pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:bg-white/10 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-accent transition-all duration-300 p-1"
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Submit button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="pt-2"
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[52px] bg-accent hover:bg-accent/90 text-primary font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-accent/25"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2.5">
                                        <FiShield size={19} />
                                        Sign In to Dashboard
                                    </span>
                                )}
                            </button>
                        </motion.div>
                    </form>

                    {/* Footer info */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 pt-6 border-t border-white/5"
                    >
                        <p className="text-center text-xs text-white/40">
                            Protected admin area • Unauthorized access prohibited
                        </p>
                    </motion.div>
                </div>

                {/* Version badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 text-center"
                >
                    {/* <span className="text-xs text-white/30">Portfolio CMS v2.0</span> */}
                </motion.div>
            </motion.div>
        </div>
    );
}
