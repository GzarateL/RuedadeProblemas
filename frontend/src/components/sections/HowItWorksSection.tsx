"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Identifica Problemas",
    description:
      "Actores externos (empresas, gobierno, sociedad civil) presentan desafíos reales que requieren soluciones innovadoras a través de esta plataforma.",
  },
  {
    number: "02",
    title: "Conecta Capacidades",
    description:
      "Investigadores y grupos de la UNSA registran sus capacidades, líneas de investigación y expertise disponibles para abordar dichos desafíos.",
  },
  {
    number: "03",
    title: "Genera Proyectos",
    description:
      "La plataforma facilita el emparejamiento. Se identifican sinergias y se formulan fichas de proyectos I+D+i+e con potencial de financiamiento (ej. fondos de canon).",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white h-full flex items-center overflow-hidden py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <motion.h2
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-12"
        >
          ¿Cómo Funciona?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.2,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border border-neutral-200 p-6 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-3">
                <span className="text-red-500 font-bold mr-2 text-2xl md:text-3xl">{step.number}</span>
                {step.title}
              </h3>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed text-justify">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
