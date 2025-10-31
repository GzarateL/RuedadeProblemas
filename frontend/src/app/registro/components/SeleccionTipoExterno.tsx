"use client";
import { BouncingBall } from "@/components/BouncingBall";
import { RainEffect } from "@/components/RainDrop";

interface Props {
  onSelectTipo: (tipo: "academia" | "gobierno" | "empresa" | "sociedad_civil") => void;
  onBack: () => void;
}

export function SeleccionTipoExterno({ onSelectTipo, onBack }: Props) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white p-4 overflow-hidden">
      {/* Animación de gotas cayendo */}
      <RainEffect />
      
      <div className="w-full max-w-4xl relative z-10 animate-[fadeInScale_0.35s_ease-out_forwards] opacity-0">
        <div className="form-card relative bg-white border-2 border-gray-300 rounded-2xl overflow-hidden transition-all duration-300">
            {/* Canvas abarca toda la tarjeta */}
            <BouncingBall />

            {/* Contenido */}
            <div className="relative z-10 bg-white/95 p-8">
              <div className="text-center space-y-2 mb-8">
                <button 
                  onClick={onBack}
                  className="mb-4 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Volver
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Seleccione tipo de usuario</h1>
                <p className="text-lg text-gray-600">
                  Elija la categoría que mejor describe su participación
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Academia */}
                <div
                  className="group relative flex h-full w-full transform-gpu flex-col items-center justify-center gap-4 rounded-xl border-2 border-black bg-gray-50 p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:shadow-lg cursor-pointer overflow-hidden"
                  onClick={() => onSelectTipo("academia")}
                >
                  <div className="text-4xl mb-2">🎓</div>
                  <h3 className="text-lg font-semibold text-gray-900">Academia</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Universidades, institutos, colegios y centros educativos
                  </p>
                  <button className="btn-register w-full bg-white border-2 border-black text-black font-semibold py-2 rounded-lg transition-all duration-300 mt-auto">
                    Seleccionar
                  </button>
                </div>

                {/* Gobierno */}
                <div
                  className="group relative flex h-full w-full transform-gpu flex-col items-center justify-center gap-4 rounded-xl border-2 border-black bg-gray-50 p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:shadow-lg cursor-pointer overflow-hidden"
                  onClick={() => onSelectTipo("gobierno")}
                >
                  <div className="text-4xl mb-2">🏛️</div>
                  <h3 className="text-lg font-semibold text-gray-900">Gobierno</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Entidades públicas, municipalidades y organismos estatales
                  </p>
                  <button className="btn-register w-full bg-white border-2 border-black text-black font-semibold py-2 rounded-lg transition-all duration-300 mt-auto">
                    Seleccionar
                  </button>
                </div>

                {/* Empresa */}
                <div
                  className="group relative flex h-full w-full transform-gpu flex-col items-center justify-center gap-4 rounded-xl border-2 border-black bg-gray-50 p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:shadow-lg cursor-pointer overflow-hidden"
                  onClick={() => onSelectTipo("empresa")}
                >
                  <div className="text-4xl mb-2">🏢</div>
                  <h3 className="text-lg font-semibold text-gray-900">Empresa</h3>
                  <p className="text-sm text-gray-600 text-center">
                    MYPES, medianas y grandes empresas del sector privado
                  </p>
                  <button className="btn-register w-full bg-white border-2 border-black text-black font-semibold py-2 rounded-lg transition-all duration-300 mt-auto">
                    Seleccionar
                  </button>
                </div>

                {/* Sociedad Civil */}
                <div
                  className="group relative flex h-full w-full transform-gpu flex-col items-center justify-center gap-4 rounded-xl border-2 border-black bg-gray-50 p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:shadow-lg cursor-pointer overflow-hidden"
                  onClick={() => onSelectTipo("sociedad_civil")}
                >
                  <div className="text-4xl mb-2">🤝</div>
                  <h3 className="text-lg font-semibold text-gray-900">Sociedad Civil</h3>
                  <p className="text-sm text-gray-600 text-center">
                    ONGs, organizaciones de base, gremios y movimientos ciudadanos
                  </p>
                  <button className="btn-register w-full bg-white border-2 border-black text-black font-semibold py-2 rounded-lg transition-all duration-300 mt-auto">
                    Seleccionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

// Estilos CSS para el efecto hover
const styles = `
  .btn-register:hover {
    background-color: #D00000 !important;
    border-color: #D00000 !important;
    color: white !important;
  }
  
  .form-card:has(.btn-register:hover) {
    border-color: #D00000 !important;
  }
`;

// Inyectar estilos en el head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}