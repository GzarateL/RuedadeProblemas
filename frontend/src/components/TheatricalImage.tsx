"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface TheatricalImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  float?: boolean;
}

export function TheatricalImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "",
  float = false 
}: TheatricalImageProps) {
  return (
    <motion.div
      animate={float ? { y: [0, -5, 0] } : undefined}
      transition={
        float
          ? {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
      className={className}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
      />
    </motion.div>
  );
}