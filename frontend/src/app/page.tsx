// /frontend/src/app/page.tsx
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [activeStep, setActiveStep] = useState(3); // Mostrar todos los pasos inmediatamente
  const howItWorksRef = useRef<HTMLElement | null>(null);

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

  // Función renderActionButtons (ajustada justificación para layout izquierda/derecha)
  const renderActionButtons = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mt-12"> {/* Cambiado a md:justify-start */}
          <div className="h-12 w-full sm:w-56 bg-neutral-200 animate-pulse rounded-lg"></div>
          <div className="h-12 w-full sm:w-40 bg-neutral-200 animate-pulse rounded-lg"></div>
        </div>
      );
    }

    if (user) {
      switch (user.rol) {
        case 'externo':
          return (
            <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mt-12 animate-fade-in animation-delay-600"> {/* Cambiado a md:justify-start */}
              <Button asChild size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <Link href="/desafio/registrar">Registrar mi Desafío</Link>
              </Button>
            </div>
          );
        case 'unsa':
          return (
            <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mt-12 animate-fade-in animation-delay-600"> {/* Cambiado a md:justify-start */}
              <Button asChild size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <Link href="/capacidad/registrar">Registrar Capacidad</Link>
              </Button>
            </div>
          );
        case 'admin':
          return (
            <div className="flex justify-center md:justify-start items-center gap-4 mt-12 animate-fade-in animation-delay-600"> {/* Cambiado a md:justify-start */}
              <Button asChild size="lg" className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-900 text-white px-8 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <Link href="/admin/dashboard">Ir al Dashboard</Link>
              </Button>
            </div>
          );
        default: return null;
      }
    } else {
      return (
        <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mt-12 animate-fade-in animation-delay-600"> {/* Cambiado a md:justify-start */}
          <Button asChild size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <Link href="/registro">Registrarse</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 rounded-lg shadow-sm border-neutral-300 hover:bg-neutral-100 transition-transform transform hover:scale-105">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Sección 1: Hero */}
      <section className="relative bg-white text-neutral-900 min-h-[70vh] flex items-center py-20 md:py-32 overflow-hidden">
        {/* Contenedor principal con flex row en md y superior */}
        <div className="max-w-6xl w-full mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 z-10">

          {/* Columna Izquierda: Logo */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start animate-fade-in">
            <Image
              src="/logo-rueda-problemas.svg" // Verifica que el nombre sea correcto
              alt="Logo Rueda de Problemas"
              width={450} // Proporción base
              height={150} // Proporción base
              priority
              className="w-auto h-auto max-w-[70%] sm:max-w-[350px] md:max-w-full lg:max-w-[450px]" // Ajusta tamaños responsivos
            />
          </div>

          {/* Columna Derecha: Texto y Botones */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <header className="animate-fade-in animation-delay-200">
              {/* --- Subtítulo estático y en negrita --- */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-700 mb-6">
                Conectando Desafíos<br />con Soluciones
              </h2>
            </header>
            <main>
              {/* --- Párrafo justificado --- */}
              <p className="text-lg text-neutral-600 leading-relaxed animate-fade-in animation-delay-400 text-justify">
                La plataforma insignia de la UNSA para la asignación estratégica de sus
                fondos de canon. Presente sus desafíos y conéctelos con nuestra
                capacidad de investigación e innovación.
              </p>
              {/* Renderiza botones, ahora justificados a la izquierda en md */}
              {renderActionButtons()}
            </main>
          </div>
        </div>
      </section>

      {/* Sección 2: ¿Qué es? */}
      {/* --- APLICADA NUEVA ANIMACIÓN DE FONDO ROJO y ajustes de texto --- */}
      <section className="relative py-20 md:py-28 overflow-hidden animate-soft-red-gradient"> {/* <- CLASE CAMBIADA */}
        {/* Contenedor con z-index para que el texto esté por encima */}
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center z-10 relative">
          {/* Texto blanco */}
          <h2 className="text-4xl font-bold text-white animate-fade-in-up">
            ¿Qué es la Rueda de Problemas?
          </h2>
          {/* Texto gris claro y justificado */}
          <p className="text-lg text-neutral-100 mt-6 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 text-justify">
            Es una metodología innovadora que conecta problemas reales del sector
            productivo, gubernamental y social con las capacidades de
            investigación e innovación de la Universidad Nacional de San Agustín
            de Arequipa. Busca impulsar el desarrollo regional mediante la
            colaboración y la aplicación del conocimiento.
          </p>
        </div>
      </section>
      {/* --- FIN CAMBIOS SECCIÓN 2 --- */}


      {/* Sección 3: ¿Cómo Funciona? */}
      <section ref={howItWorksRef} className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h2 className="text-4xl font-bold text-neutral-900 text-center mb-16">
            ¿Cómo Funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="border border-neutral-200 p-8 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                  <span className="text-red-500 font-bold mr-3 text-3xl">{step.number}</span>
                  {step.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed text-justify">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}