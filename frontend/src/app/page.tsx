// /frontend/src/app/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const previousScrollY = useRef(0);
  const scrollDirectionRef = useRef<"up" | "down">("down");
  const hasTriggeredRef = useRef(false);
  const isSectionVisibleRef = useRef(false);
  const howItWorksRef = useRef<HTMLElement | null>(null);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  const resetSequence = useCallback(() => {
    clearTimers();
    setActiveStep(0);
  }, [clearTimers]);

  const triggerSequence = useCallback(() => {
    clearTimers();
    setActiveStep(0);
    timeoutsRef.current = [
      setTimeout(() => setActiveStep(1), 0),
      setTimeout(() => setActiveStep(2), 600),
      setTimeout(() => setActiveStep(3), 1200),
    ];
  }, [clearTimers]);

  useEffect(() => {
    previousScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      let newDirection: "up" | "down" = scrollDirectionRef.current;

      if (currentY > previousScrollY.current) {
        newDirection = "down";
      } else if (currentY < previousScrollY.current) {
        newDirection = "up";
      }

      if (newDirection !== scrollDirectionRef.current) {
        scrollDirectionRef.current = newDirection;

        if (newDirection === "up") {
          hasTriggeredRef.current = false;
          resetSequence();
        } else if (newDirection === "down" && isSectionVisibleRef.current && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          triggerSequence();
        }
      } else if (newDirection === "down" && isSectionVisibleRef.current && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        triggerSequence();
      }

      previousScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [resetSequence, triggerSequence]);

  useEffect(() => {
    const sectionElement = howItWorksRef.current;
    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isSectionVisibleRef.current = true;

            if (scrollDirectionRef.current === "down" && !hasTriggeredRef.current) {
              hasTriggeredRef.current = true;
              triggerSequence();
            }
          } else {
            isSectionVisibleRef.current = false;
            hasTriggeredRef.current = false;
            resetSequence();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
    };
  }, [resetSequence, triggerSequence]);

  useEffect(() => () => clearTimers(), [clearTimers]);

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
              <Button asChild size="lg" className="bg-white border-2 border-black text-black font-semibold px-8 py-3 rounded-lg transition-all duration-250 ease-in-out hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white">
                <Link href="/desafio/registrar">Registrar mi Desafío</Link>
              </Button>
            </div>
          );
        case 'unsa':
          return (
            <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 mt-12 animate-fade-in animation-delay-600"> {/* Cambiado a md:justify-start */}
              <Button asChild size="lg" className="bg-white border-2 border-black text-black font-semibold px-8 py-3 rounded-lg transition-all duration-250 ease-in-out hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white">
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

    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Sección 1: Hero */}
      <section className="relative bg-grid-pattern text-neutral-900 min-h-[70vh] flex items-center py-20 md:py-32 overflow-hidden">
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
          <h2 className="text-4xl font-bold text-neutral-900 text-center mb-16 animate-fade-in-up">
            ¿Cómo Funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const stepOrder = index + 1;
              const isVisible = activeStep >= stepOrder;

              return (
                <div
                  key={step.number}
                  className={`border border-neutral-200 p-8 rounded-lg shadow-sm bg-white transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                >
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                    <span className="text-electric animate-glow-pulse font-bold mr-3 text-3xl">{step.number}</span>
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed text-justify">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}