"use client";

import { useEffect, useState } from "react";

// Genera estilos aleatorios para cada gota
const createRaindropStyle = (): React.CSSProperties => {
  const size = Math.random() * 20 + 12; // 12-32px (gotas más grandes)
  const left = Math.random() * 100; // 0-100% horizontal
  const duration = Math.random() * 4 + 3; // 3-7 segundos (más lentas)
  const delay = Math.random() * 3; // 0-3s delay

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: "-20px",
    opacity: 1, // Sin transparencia
    animation: `fall ${duration}s linear ${delay}s infinite`,
  };
};

// Componente individual de gota
const RainDrop = ({ style }: { style: React.CSSProperties }) => {
  return (
    <div
      className="absolute bg-red-500 rounded-full animate-fall pointer-events-none"
      style={style}
    />
  );
};

// Componente contenedor de lluvia
export function RainEffect() {
  const [raindrops, setRaindrops] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    // Crear 50 gotas iniciales (más cantidad)
    const initialDrops = Array.from({ length: 50 }, () => createRaindropStyle());
    setRaindrops(initialDrops);

    // Crear nuevas gotas cada 400ms (más frecuentes)
    const interval = setInterval(() => {
      setRaindrops((prev) => {
        // Limitar a 80 gotas máximo para performance
        const filtered = prev.length > 80 ? prev.slice(-60) : prev;
        return [...filtered, createRaindropStyle()];
      });
    }, 400);

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
