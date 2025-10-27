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
  const [heroVisible, setHeroVisible] = useState(false);
  const [whatIsVisible, setWhatIsVisible] = useState(false);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const previousScrollY = useRef(0);
  const scrollDirectionRef = useRef<"up" | "down">("down");
  const hasTriggeredRef = useRef(false);
  const isSectionVisibleRef = useRef(false);
  const howItWorksRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const whatIsRef = useRef<HTMLElement | null>(null);

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

  // Animación teatral para Hero - aparece al cargar
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Observador para sección "¿Qué es?" - aparece al entrar en viewport
  useEffect(() => {
    const element = whatIsRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setWhatIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

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
      {/* Sección 1: Hero - Animación Teatral */}
      <section 
        ref={heroRef}
        className="relative bg-white text-neutral-900 min-h-[70vh] flex items-center py-20 md:py-32 overflow-hidden"
      >
        {/* Contenedor principal con animación teatral */}
        <div className={`max-w-6xl w-full mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 z-10 transition-all duration-1000 ease-out ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>

          {/* Columna Izquierda: Logo con animación de construcción */}
          <div className={`w-full md:w-1/2 flex justify-center md:justify-start transition-all duration-1200 ease-out ${
            heroVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-12'
          }`}>
            <Image
              src="/logo-rueda-problemas.svg"
              alt="Logo Rueda de Problemas"
              width={450}
              height={150}
              priority
              className="w-auto h-auto max-w-[70%] sm:max-w-[350px] md:max-w-full lg:max-w-[450px]"
            />
          </div>

          {/* Columna Derecha: Texto y Botones con animación escalonada */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <header className={`transition-all duration-1000 delay-300 ease-out ${
              heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-700 mb-6">
                Conectando Desafíos<br />con Soluciones
              </h2>
            </header>
            <main>
              <p className={`text-lg text-neutral-600 leading-relaxed text-justify transition-all duration-1000 delay-500 ease-out ${
                heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}>
                La plataforma insignia de la UNSA para la asignación estratégica de sus
                fondos de canon. Presente sus desafíos y conéctelos con nuestra
                capacidad de investigación e innovación.
              </p>
              <div className={`transition-all duration-1000 delay-700 ease-out ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {renderActionButtons()}
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Sección 2: ¿Qué es? - Animación Teatral de Construcción */}
      <section 
        ref={whatIsRef}
        className="relative py-20 md:py-28 overflow-hidden animate-soft-red-gradient"
      >
        {/* Contenedor con animación teatral */}
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center z-10 relative">
          {/* Título con animación de construcción desde arriba */}
          <h2 className={`text-4xl font-bold text-white transition-all duration-1000 ease-out ${
            whatIsVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-95'
          }`}>
            ¿Qué es la Rueda de Problemas?
          </h2>
          {/* Texto con animación de construcción desde abajo */}
          <p className={`text-lg text-neutral-100 mt-6 max-w-3xl mx-auto leading-relaxed text-justify transition-all duration-1000 delay-300 ease-out ${
            whatIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            Es una metodología innovadora que conecta problemas reales del sector
            productivo, gubernamental y social con las capacidades de
            investigación e innovación de la Universidad Nacional de San Agustín
            de Arequipa. Busca impulsar el desarrollo regional mediante la
            colaboración y la aplicación del conocimiento.
          </p>
        </div>
      </section>


      {/* Sección 3: ¿Cómo Funciona? - Construcción Teatral Escalonada */}
      <section ref={howItWorksRef} className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h2 className={`text-4xl font-bold text-neutral-900 text-center mb-16 transition-all duration-1000 ease-out ${
            activeStep >= 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
          }`}>
            ¿Cómo Funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const stepOrder = index + 1;
              const isVisible = activeStep >= stepOrder;

              return (
                <div
                  key={step.number}
                  className={`border border-neutral-200 p-8 rounded-lg shadow-sm bg-white transition-all duration-700 ease-out ${
                    isVisible 
                      ? "opacity-100 translate-y-0 scale-100" 
                      : "opacity-0 translate-y-12 scale-95"
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${index * 150}ms` : "0ms"
                  }}
                >
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                    <span className="text-red-500 font-bold mr-3 text-3xl">{step.number}</span>
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