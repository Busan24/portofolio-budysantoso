"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

const Modal = ({ isOpen, onClose, children, className }) => {
    // Close on escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "relative bg-[#27272c] rounded-xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto w-[95%] max-w-lg",
                            className
                        )}
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const ModalHeader = ({ className, children, onClose }) => (
    <div className={cn("flex items-center justify-between p-6 border-b border-white/10", className)}>
        <div>{children}</div>
        {onClose && (
            <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
                <FiX size={20} />
            </button>
        )}
    </div>
);

const ModalTitle = ({ className, children }) => (
    <h2 className={cn("text-xl font-semibold text-white", className)}>
        {children}
    </h2>
);

const ModalDescription = ({ className, children }) => (
    <p className={cn("text-sm text-white/60 mt-1", className)}>
        {children}
    </p>
);

const ModalBody = ({ className, children }) => (
    <div className={cn("p-6", className)}>
        {children}
    </div>
);

const ModalFooter = ({ className, children }) => (
    <div className={cn("flex items-center justify-end gap-3 p-6 border-t border-white/10", className)}>
        {children}
    </div>
);

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter };
