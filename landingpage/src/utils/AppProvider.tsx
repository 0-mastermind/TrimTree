import React from "react";
import Navbar from "../components/Navbar";
import PhoneSidebar from "@/components/PhoneSidebar";
import { div } from "framer-motion/client";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="bg-white dark:bg-[var(--primary-background)]">
        <div className="container mx-auto">
          <Navbar />
          <PhoneSidebar />
        </div>
      </div>
      <div className="container mx-auto">
        {children}
        {/* Hello! Testing branch protection */}
      </div>
    </div>
  );
};

export default AppProvider;
