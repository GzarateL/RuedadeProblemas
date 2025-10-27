"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface TheatricalSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animationType?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale";
  threshold?: number;
}

export function TheatricalSection({
  children,
  className = "",
  delay = 0,
  animationType = "fade",
  threshold = 0.2,
}: TheatricalSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-1000 ease-out";
    
    switch (animationType) {
      case "slide-up":
        return `${baseClasses} ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`;
      case "slide-left":
        return `${baseClasses} ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
        }`;
      case "slide-right":
        return `${baseClasses} ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
        }`;
      case "scale":
        return `${baseClasses} ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`;
      case "fade":
      default:
        return `${baseClasses} ${
          isVisible ? "opacity-100" : "opacity-0"
        }`;
    }
  };

  return (
    <div ref={sectionRef} className={`${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  );
}
