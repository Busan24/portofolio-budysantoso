"use client";

import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 backdrop-blur-md border-2 border-gray-300 dark:border-white/20 hover:border-accent transition-all duration-300 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle Theme"
    >
      {/* Sun Icon (Light Mode) */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{
          scale: theme === "light" ? 1 : 0,
          rotate: theme === "light" ? 0 : -90,
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <FiSun className="text-xl text-amber-500" />
      </motion.div>

      {/* Moon Icon (Dark Mode) */}
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{
          scale: theme === "dark" ? 1 : 0,
          rotate: theme === "dark" ? 0 : 90,
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <FiMoon className="text-xl text-accent" />
      </motion.div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md" />
    </motion.button>
  );
};

export default ThemeToggle;
