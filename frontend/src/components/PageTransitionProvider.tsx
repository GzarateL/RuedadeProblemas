"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { TheatricalTransition } from "./TheatricalTransition";

interface PageTransitionProviderProps {
  children: ReactNode;
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <TheatricalTransition key={pathname}>
        {children}
      </TheatricalTransition>
    </AnimatePresence>
  );
}
