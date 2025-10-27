"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ViewportSection {
  id: string;
  component: ReactNode;
}

interface ViewportAnchoredViewProps {
  sections: ViewportSection[];
  transitionDuration?: number;
  scrollThreshold?: number;
}

export default function ViewportAnchoredView({
  sections,
  transitionDuration = 0.8,
  scrollThreshold = 50,
}: ViewportAnchoredViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const isTransitioning = useRef(false);
  const lastScrollTime = useRef(0);
  const accumulatedDelta = useRef(0);

  useEffect(() => {
    // Prevenir scroll del navegador pero mantener el layout normal
    document.body.style.overflow = "hidden";

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;

      // Debouncing: ignorar eventos muy rápidos
      if (timeSinceLastScroll < 50) return;

      // Acumular delta para detectar intención clara
      accumulatedDelta.current += e.deltaY;

      // Si estamos en transición, ignorar
      if (isTransitioning.current) {
        accumulatedDelta.current = 0;
        return;
      }

      // Detectar dirección y cambiar sección
      if (Math.abs(accumulatedDelta.current) > scrollThreshold) {
        const scrollingDown = accumulatedDelta.current > 0;

        if (scrollingDown && currentIndex < sections.length - 1) {
          setDirection("forward");
          setCurrentIndex((prev) => prev + 1);
          isTransitioning.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, transitionDuration * 1000);
        } else if (!scrollingDown && currentIndex > 0) {
          setDirection("backward");
          setCurrentIndex((prev) => prev - 1);
          isTransitioning.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, transitionDuration * 1000);
        }

        accumulatedDelta.current = 0;
        lastScrollTime.current = now;
      }
    };

    // Soporte para teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning.current) return;

      if ((e.key === "ArrowDown" || e.key === "PageDown") && currentIndex < sections.length - 1) {
        e.preventDefault();
        setDirection("forward");
        setCurrentIndex((prev) => prev + 1);
        isTransitioning.current = true;
        setTimeout(() => {
          isTransitioning.current = false;
        }, transitionDuration * 1000);
      } else if ((e.key === "ArrowUp" || e.key === "PageUp") && currentIndex > 0) {
        e.preventDefault();
        setDirection("backward");
        setCurrentIndex((prev) => prev - 1);
        isTransitioning.current = true;
        setTimeout(() => {
          isTransitioning.current = false;
        }, transitionDuration * 1000);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, sections.length, scrollThreshold, transitionDuration]);

  // Variantes de animación
  const variants = {
    enter: (direction: "forward" | "backward") => ({
      opacity: 0,
      y: direction === "forward" ? 100 : -100,
      scale: 0.95,
    }),
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: (direction: "forward" | "backward") => ({
      opacity: 0,
      y: direction === "forward" ? -100 : 100,
      scale: 0.95,
    }),
  };

  return (
    <div className="relative w-full overflow-hidden bg-white" style={{ height: 'calc(100vh - 4rem)' }}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: transitionDuration,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 w-full h-full"
        >
          {sections[currentIndex].component}
        </motion.div>
      </AnimatePresence>

      {/* Indicador de navegación */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning.current && index !== currentIndex) {
                setDirection(index > currentIndex ? "forward" : "backward");
                setCurrentIndex(index);
                isTransitioning.current = true;
                setTimeout(() => {
                  isTransitioning.current = false;
                }, transitionDuration * 1000);
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-red-600 scale-125"
                : "bg-neutral-300 hover:bg-neutral-400"
            }`}
            aria-label={`Ir a sección ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
