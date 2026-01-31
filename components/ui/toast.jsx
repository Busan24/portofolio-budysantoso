"use client";

import { Toaster as HotToaster, toast } from "react-hot-toast";
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from "react-icons/fi";

// Toast provider component
export const ToastProvider = () => (
    <HotToaster
        position="top-right"
        toastOptions={{
            duration: 4000,
            style: {
                background: "#27272c",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "16px",
            },
        }}
    />
);

// Custom toast functions
export const showToast = {
    success: (message) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-[#27272c] border border-green-500/30 rounded-xl p-4 flex items-center gap-3 shadow-lg`}
            >
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <FiCheck className="text-green-400" size={18} />
                </div>
                <p className="text-white text-sm flex-1">{message}</p>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-white/40 hover:text-white transition-colors"
                >
                    <FiX size={18} />
                </button>
            </div>
        ));
    },

    error: (message) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-[#27272c] border border-red-500/30 rounded-xl p-4 flex items-center gap-3 shadow-lg`}
            >
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <FiX className="text-red-400" size={18} />
                </div>
                <p className="text-white text-sm flex-1">{message}</p>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-white/40 hover:text-white transition-colors"
                >
                    <FiX size={18} />
                </button>
            </div>
        ));
    },

    warning: (message) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-[#27272c] border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3 shadow-lg`}
            >
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <FiAlertTriangle className="text-yellow-400" size={18} />
                </div>
                <p className="text-white text-sm flex-1">{message}</p>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-white/40 hover:text-white transition-colors"
                >
                    <FiX size={18} />
                </button>
            </div>
        ));
    },

    info: (message) => {
        toast.custom((t) => (
            <div
                className={`${t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-[#27272c] border border-accent/30 rounded-xl p-4 flex items-center gap-3 shadow-lg`}
            >
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <FiInfo className="text-accent" size={18} />
                </div>
                <p className="text-white text-sm flex-1">{message}</p>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-white/40 hover:text-white transition-colors"
                >
                    <FiX size={18} />
                </button>
            </div>
        ));
    },
};

export default toast;
