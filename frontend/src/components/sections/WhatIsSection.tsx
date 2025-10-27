"use client";

import { motion } from "framer-motion";

export default function WhatIsSection() {
  return (
    <section className="relative h-full flex items-center justify-center overflow-hidden animate-soft-red-gradient py-12">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center z-10 relative">
        <motion.h2
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-4xl font-bold text-white"
        >
          ¿Qué es la Rueda de Problemas?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-base md:text-lg text-neutral-100 mt-6 max-w-3xl mx-auto leading-relaxed text-justify"
        >
          Es una metodología innovadora que conecta problemas reales del sector productivo,
          gubernamental y social con las capacidades de investigación e innovación de la
          Universidad Nacional de San Agustín de Arequipa. Busca impulsar el desarrollo regional
          mediante la colaboración y la aplicación del conocimiento.
        </motion.p>
      </div>
    </section>
  );
}
