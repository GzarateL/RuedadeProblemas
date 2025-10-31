"use client";
import { BouncingBall } from "@/components/BouncingBall";
import { RainEffect } from "@/components/RainDrop";

interface Props {
  onSelectRol: (rol: "externo" | "unsa") => void;
}

export function SeleccionRol({ onSelectRol }: Props) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white p-4 overflow-hidden">
      {/* Animación de gotas cayendo */}
      <RainEffect />
      
      <div className="w-full max-w-3xl relative z-10 animate-[fadeInScale_0.35s_ease-out_forwards] opacity-0">
        <div className="relative bg-white border-2 border-black rounded-2xl overflow-hidden transition-[border-color] duration-250 ease-in-out">
            {/* Canvas abarca toda la tarjeta */}
            <BouncingBall />

            {/* Contenido */}
            <div className="relative z-10 bg-white/95 p-8">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Registro</h1>
                <p className="text-lg text-gray-600">
                  Por favor, seleccione el tipo de cuenta que desea crear.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                <div
                  className="group relative flex h-full w-full transform-gpu flex-col items-center justify-center gap-4 rounded-xl border-2 border-black bg-gray-50 p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:shadow-lg focus-within:-translate-y-1 focus-within:scale-[1.02] focus-within:shadow-lg cursor-pointer overflow-hidden group-hover:items-start group-hover:text-left"
                  onClick={() => onSelectRol("externo")}
                >
                  <h3 className="text-xl font-semibold text-gray-900">Hélice Externa</h3>
                  
                  {/* Contenido expandible */}
                  <div className="flex w-full max-h-0 flex-col items-start gap-3 overflow-hidden text-sm leading-relaxed text-gray-600 opacity-0 transition-all duration-300 ease-out group-hover:max-h-[320px] group-hover:opacity-100 group-hover:delay-100 group-focus-within:max-h-[320px] group-focus-within:opacity-100 md:text-justify">
                    <p className="w-full text-gray-500">
                      Sectores públicos, privados o sociales interesados en presentar desafíos reales.
                    </p>
                    <p className="w-full">
                      Conecta desafíos reales de organizaciones y coordina soluciones colaborativas junto a la comunidad Hélice UNSA.
                    </p>
                    <button
                      className="w-full bg-white border-2 border-black text-black font-semibold py-3 rounded-lg opacity-0 transition-all duration-250 ease-in-out group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:delay-200 group-focus-within:-translate-y-0.5 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto hover:bg-electric hover:border-electric hover:text-white"
                      onMouseEnter={(e) => {
                        const card = e.currentTarget.closest('.group');
                        const container = card?.parentElement?.parentElement?.parentElement;
                        if (card) card.classList.add('!border-[#FF0000]');
                        if (container) container.classList.add('!border-[#FF0000]');
                      }}
                      onMouseLeave={(e) => {
                        const card = e.currentTarget.closest('.group');
                        const container = card?.parentElement?.parentElement?.parentElement;
                        if (card) card.classList.remove('!border-[#FF0000]');
                        if (container) container.classList.remove('!border-[#FF0000]');
                      }}
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>

                <div
                  className="group relative flex h-full w-full transform-gpu flex-col items-center justify-center gap-4 rounded-xl border-2 border-black bg-gray-50 p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:shadow-lg focus-within:-translate-y-1 focus-within:scale-[1.02] focus-within:shadow-lg cursor-pointer overflow-hidden group-hover:items-start group-hover:text-left"
                  onClick={() => onSelectRol("unsa")}
                >
                  <h3 className="text-xl font-semibold text-gray-900">Hélice UNSA</h3>
                  
                  {/* Contenido expandible */}
                  <div className="flex w-full max-h-0 flex-col items-start gap-3 overflow-hidden text-sm leading-relaxed text-gray-600 opacity-0 transition-all duration-300 ease-out group-hover:max-h-[320px] group-hover:opacity-100 group-hover:delay-100 group-focus-within:max-h-[320px] group-focus-within:opacity-100 md:text-justify">
                    <p className="w-full text-gray-500">
                      Investigadores, docentes y personal UNSA que impulsan soluciones académicas.
                    </p>
                    <p className="w-full">
                      Participa con equipos académicos, comparte capacidades y acompaña la resolución de desafíos con instituciones aliadas.
                    </p>
                    <button
                      className="w-full bg-white border-2 border-black text-black font-semibold py-3 rounded-lg opacity-0 transition-all duration-250 ease-in-out group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:delay-200 group-focus-within:-translate-y-0.5 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto hover:bg-electric hover:border-electric hover:text-white"
                      onMouseEnter={(e) => {
                        const card = e.currentTarget.closest('.group');
                        const container = card?.parentElement?.parentElement?.parentElement;
                        if (card) card.classList.add('!border-[#FF0000]');
                        if (container) container.classList.add('!border-[#FF0000]');
                      }}
                      onMouseLeave={(e) => {
                        const card = e.currentTarget.closest('.group');
                        const container = card?.parentElement?.parentElement?.parentElement;
                        if (card) card.classList.remove('!border-[#FF0000]');
                        if (container) container.classList.remove('!border-[#FF0000]');
                      }}
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
