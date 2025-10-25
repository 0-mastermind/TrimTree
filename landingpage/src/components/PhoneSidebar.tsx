"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggler from "./ThemeToggler";
import Link from "next/link";

const PhoneSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };

  return (
    <nav className="block md:hidden">
      {/* Top Navbar */}
      <div className="mt-4 flex justify-between items-center px-4">
        <h1 className="font-inter font-bold text-lg dark:text-[var(--text-white)] mt-1">Trim Tree Salon</h1>

        <div className="flex gap-4 items-center justify-between">
          <ThemeToggler />
          {/* Menu Icon */}
          <button onClick={() => setIsOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu dark:text-[var(--text-white)]">
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-900/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}>
            <motion.div
              className="fixed top-0 right-0 h-full w-2/4 bg-gray-100 shadow-xl z-50 p-6"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}>
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              {/* Links */}
              <ul className="mt-16 space-y-6 text-lg font-semibold text-gray-800">
                <li>
                  <Link href="/#about" onClick={() => setIsOpen(false)}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/#services" onClick={() => setIsOpen(false)}>
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/#team" onClick={() => setIsOpen(false)}>
                    Our Team
                  </Link>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PhoneSidebar;
