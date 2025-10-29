"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RainEffect } from "@/components/RainDrop";

interface Props {
  onSelectRol: (rol: "externo" | "unsa") => void;
}

export function SeleccionRol({ onSelectRol }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(timeout);
  }, []);

  const roleCardBase = useMemo(
    () =>
      "group relative flex h-full w-full transform-gpu flex-col items-center justify-center gap-4 rounded-xl border border-neutral-200 bg-white/80 p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-neutral-300 hover:bg-white hover:shadow-lg focus-within:-translate-y-1 focus-within:scale-[1.02] focus-within:border-neutral-300 focus-within:shadow-lg cursor-pointer overflow-hidden group-hover:items-start group-hover:text-left",
    []
  );

  const roleAnimation = isMounted
    ? "opacity-100 translate-y-0 scale-100"
    : "opacity-0 translate-y-8 scale-95";

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 to-white transition-opacity duration-700 ${
        isMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Animación de gotas cayendo */}
      <RainEffect />
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute -top-32 -left-24 h-72 w-72 rounded-full bg-[#d80c0d]/15 blur-3xl transition-all duration-[1200ms] ease-out ${
            isMounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
        />
        <div
          className={`absolute -bottom-24 -right-28 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl transition-all duration-[1200ms] ease-out ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        />
        <div
          className={`absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/30 blur-[120px] transition-all duration-[1200ms] ease-out ${
            isMounted ? "opacity-60 scale-100" : "opacity-0 scale-75"
          }`}
        />
      </div>
      <Card
        className={`relative z-10 w-full max-w-3xl border border-slate-200 bg-white shadow-[0_25px_70px_-25px_rgba(15,23,42,0.35)] transform-gpu transition-all duration-700 ease-out ${
          isMounted
            ? "opacity-100 translate-y-0 scale-100 blur-0"
            : "opacity-0 translate-y-8 scale-95 blur-sm"
        }`}
      >
        <CardHeader
          className={`text-center transition-all duration-700 ease-out ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
          style={{ transitionDelay: isMounted ? "160ms" : "0ms" }}
        >
          <CardTitle className="text-3xl font-bold">Bienvenido al Registro</CardTitle>
          <CardDescription className="text-lg pt-2">
            Por favor, seleccione el tipo de cuenta que desea crear.
          </CardDescription>
        </CardHeader>
        <CardContent
          className={`p-6 md:p-10 transition-all duration-700 ease-out ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: isMounted ? "260ms" : "0ms" }}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <div
              className={`${roleCardBase} ${roleAnimation}`}
              style={{ transitionDelay: isMounted ? "120ms" : "0ms" }}
              onClick={() => onSelectRol("externo")}
            >
              <h3 className="text-xl font-semibold text-neutral-900">Hélice Externa</h3>
              <div className="flex w-full max-h-0 flex-col items-start gap-3 overflow-hidden text-sm leading-relaxed text-neutral-600 opacity-0 transition-all duration-300 ease-out group-hover:max-h-[320px] group-hover:opacity-100 group-hover:delay-100 group-focus-within:max-h-[320px] group-focus-within:opacity-100 md:text-justify">
                <p className="w-full text-neutral-500">
                  Sectores públicos, privados o sociales interesados en presentar desafíos reales.
                </p>
                <p className="w-full">
                  Conecta desafíos reales de organizaciones y coordina soluciones colaborativas junto a la comunidad Hélice UNSA.
                </p>
                <Button
                  className="h-12 w-full justify-center bg-slate-900 text-white opacity-0 transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:bg-slate-900 group-hover:opacity-100 group-hover:shadow-md group-hover:delay-200 group-focus-within:-translate-y-0.5 group-focus-within:bg-slate-900 group-focus-within:opacity-100 group-focus-within:shadow-md pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto hover:!bg-[#d80c0d]"
                >
                  Seleccionar
                </Button>
              </div>
            </div>
            <div
              className={`${roleCardBase} ${roleAnimation}`}
              style={{ transitionDelay: isMounted ? "220ms" : "0ms" }}
              onClick={() => onSelectRol("unsa")}
            >
              <h3 className="text-xl font-semibold text-neutral-900">Hélice UNSA</h3>
              <div className="flex w-full max-h-0 flex-col items-start gap-3 overflow-hidden text-sm leading-relaxed text-neutral-600 opacity-0 transition-all duration-300 ease-out group-hover:max-h-[320px] group-hover:opacity-100 group-hover:delay-100 group-focus-within:max-h-[320px] group-focus-within:opacity-100 md:text-justify">
                <p className="w-full text-neutral-500">
                  Investigadores, docentes y personal UNSA que impulsan soluciones académicas.
                </p>
                <p className="w-full">
                  Participa con equipos académicos, comparte capacidades y acompaña la resolución de desafíos con instituciones aliadas.
                </p>
                <Button
                  className="h-12 w-full justify-center bg-slate-900 text-white opacity-0 transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:bg-slate-900 group-hover:opacity-100 group-hover:shadow-md group-hover:delay-200 group-focus-within:-translate-y-0.5 group-focus-within:bg-slate-900 group-focus-within:opacity-100 group-focus-within:shadow-md pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto hover:!bg-[#d80c0d]"
                >
                  Seleccionar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}