"use client";

import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";

const DeleteConfirm = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
            <ModalBody className="pt-6">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4"
                    >
                        <FiAlertTriangle size={32} className="text-red-400" />
                    </motion.div>

                    <h3 className="text-xl font-semibold text-white mb-2">
                        {title || "Delete Item"}
                    </h3>

                    <p className="text-white/60 text-sm">
                        {message || "Are you sure you want to delete this item? This action cannot be undone."}
                    </p>
                </div>
            </ModalBody>

            <ModalFooter className="justify-center">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                    className="hover:bg-white/5"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 text-white"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Deleting...</span>
                        </div>
                    ) : (
                        "Delete"
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteConfirm;
