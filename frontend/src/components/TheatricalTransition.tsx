"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TheatricalTransitionProps {
  children: ReactNode;
}

export function TheatricalTransition({ children }: TheatricalTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="min-h-screen"
      style={{ 
        position: 'relative',
        willChange: 'opacity'
      }}
    >
      {children}
    </motion.div>
  );
}
