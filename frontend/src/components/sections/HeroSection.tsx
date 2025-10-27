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
    /* ... (tu función renderActionButtons - sin cambios) ... */
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
      {/* Este 'min-h' es correcto. Es la altura de la pantalla (100vh)
        menos la altura de tu Navbar (4rem = h-16).
        El 'flex items-center' centra el <div> de abajo verticalmente.
      */}

      <div
        className="
          max-w-6xl w-full mx-auto px-6 sm:px-8 z-10
          flex flex-col md:flex-row justify-center 
          gap-6 md:gap-12
        "
      >
        {/* CAMBIO CLAVE #1: 
          Quité 'items-center' de esta línea.
          Ahora usará 'items-stretch' (el default), forzando a
          ambas columnas a tener la misma altura.
        */}
        
        {/* Columna Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full md:w-1/2 flex items-center justify-center md:justify-start"
        >
          {/* Esto es correcto: 'flex items-center' centra el logo
            verticalmente DENTRO de esta columna.
          */}
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
        <div 
          className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center"
        >
          {/* CAMBIO CLAVE #2:
            Añadí 'flex flex-col justify-center'.
            Como la columna es 'flex-col', 'justify-center' la centrará
            verticalmente DENTRO de esta columna.
          */}
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