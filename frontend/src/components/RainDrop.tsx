"use client";

import { useEffect, useState } from "react";

// Genera estilos aleatorios para cada gota
const createRaindropStyle = (): React.CSSProperties => {
  const size = Math.random() * 30 + 10; // 10-40px (más grandes)
  const left = Math.random() * 100; // 0-100% horizontal
  const duration = Math.random() * 3 + 2; // 2-5 segundos
  const delay = Math.random() * 2; // 0-2s delay
  const opacity = Math.random() * 0.5 + 0.4; // 0.4-0.9 opacidad (más visibles)

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: "-20px",
    opacity,
    animation: `fall ${duration}s linear ${delay}s infinite`,
  };
};

// Componente individual de gota
const RainDrop = ({ style }: { style: React.CSSProperties }) => {
  return (
    <div
      className="absolute bg-red-500/40 rounded-full animate-fall pointer-events-none"
      style={style}
    />
  );
};

// Componente contenedor de lluvia
export function RainEffect() {
  const [raindrops, setRaindrops] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    console.log("RainEffect montado - iniciando animación");
    // Crear 50 gotas iniciales
    const initialDrops = Array.from({ length: 50 }, () => createRaindropStyle());
    setRaindrops(initialDrops);
    console.log(`Creadas ${initialDrops.length} gotas iniciales`);

    // Crear nuevas gotas cada 300ms
    const interval = setInterval(() => {
      setRaindrops((prev) => {
        // Limitar a 100 gotas máximo para performance
        const filtered = prev.length > 100 ? prev.slice(-80) : prev;
        return [...filtered, createRaindropStyle()];
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {raindrops.map((style, index) => (
        <RainDrop key={`raindrop-${index}`} style={style} />
      ))}
    </>
  );
}
