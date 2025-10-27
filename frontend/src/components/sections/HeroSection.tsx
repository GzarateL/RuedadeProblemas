"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroSectionProps {
  user: any;
  isLoading: boolean;
}

export default function HeroSection({ user, isLoading }: HeroSectionProps) {
  const renderActionButtons = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mt-8">
          <div className="h-12 w-full sm:w-56 bg-neutral-200 animate-pulse rounded-lg"></div>
          <div className="h-12 w-full sm:w-40 bg-neutral-200 animate-pulse rounded-lg"></div>
        </div>
      );
    }

    if (user) {
      switch (user.rol) {
        case "externo":
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mt-8"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                <Link href="/desafio/registrar">Registrar mi Desafío</Link>
              </Button>
            </motion.div>
          );
        case "unsa":
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mt-8"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                <Link href="/capacidad/registrar">Registrar Capacidad</Link>
              </Button>
            </motion.div>
          );
        case "admin":
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex justify-center md:justify-start items-center gap-4 mt-8"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-900 text-white px-8 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                <Link href="/admin/dashboard">Ir al Dashboard</Link>
              </Button>
            </motion.div>
          );
        default:
          return null;
      }
    } else {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mt-8"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <Link href="/registro">Registrarse</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto px-8 py-3 rounded-lg shadow-sm border-neutral-300 hover:bg-neutral-100 transition-transform transform hover:scale-105"
          >
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </motion.div>
      );
    }
  };

  return (
    <section
      className="
        relative bg-white text-neutral-900 w-full overflow-hidden
        flex items-center justify-center 
        min-h-[calc(100vh-4rem)]
      "
    >
      {/* Explicación:
        1. min-h-[calc(100vh-4rem)]:
           - 100vh = 100% de la altura de la pantalla.
           - 4rem = La altura de tu Navbar (h-16 = 16 * 0.25rem = 4rem).
           - Esto hace que la sección llene EXACTAMENTE el espacio restante.
        2. flex items-center justify-center:
           - Centra verticalmente (items-center) y horizontalmente (justify-center)
             el <div> hijo (el max-w-6xl).
      */}

      <div
        className="
          max-w-6xl w-full mx-auto px-6 sm:px-8 z-10
          flex flex-col md:flex-row items-center justify-center 
          gap-6 md:gap-12
        "
      >
        {/* Explicación:
          1. md:flex-row: Pone las columnas una al lado de la otra en desktop.
          2. items-center: ¡Esta es la clave! Alinea verticalmente
             ambas columnas (Logo y Texto) para que estén centradas
             una respecto a la otra.
        */}
        
        {/* Columna Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full md:w-1/2 flex items-center justify-center md:justify-start"
        >
          <Image
            src="/logo-rueda-problemas.svg"
            alt="Logo Rueda de Problemas"
            width={400}
            height={130}
            priority
            className="w-auto h-auto max-w-[60%] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px]"
          />
        </motion.div>

        {/* Columna Texto y Botones */}
        {/* Ya no necesita 'justify-center' porque el 'items-center' del div padre se encarga */}
        <div className="w-full md:w-1/2 text-center md:text-left flex flex-col">
          <motion.header
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-700 mb-4">
              Conectando Desafíos
              <br />
              con Soluciones
            </h2>
          </motion.header>
          <motion.main
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-base md:text-lg text-neutral-600 leading-relaxed text-justify">
              La plataforma insignia de la UNSA para la asignación estratégica de sus fondos de
              canon. Presente sus desafíos y conéctelos con nuestra capacidad de investigación e
              innovación.
            </p>
            {renderActionButtons()}
          </motion.main>
        </div>
      </div>
    </section>
  );
}