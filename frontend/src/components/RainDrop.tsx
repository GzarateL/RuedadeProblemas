"use client";

import { useEffect, useState } from "react";

// Genera estilos aleatorios para cada gota
const createRaindropStyle = (): React.CSSProperties => {
  const size = Math.random() * 8 + 3; // 3-11px (más pequeñas)
  const left = Math.random() * 100; // 0-100% horizontal
  const duration = Math.random() * 4 + 3; // 3-7 segundos (más lentas)
  const delay = Math.random() * 3; // 0-3s delay
  const opacity = Math.random() * 0.15 + 0.05; // 0.05-0.2 opacidad (más sutiles)

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
    // Crear 20 gotas iniciales (menos cantidad)
    const initialDrops = Array.from({ length: 20 }, () => createRaindropStyle());
    setRaindrops(initialDrops);

    // Crear nuevas gotas cada 800ms (menos frecuentes)
    const interval = setInterval(() => {
      setRaindrops((prev) => {
        // Limitar a 40 gotas máximo para performance
        const filtered = prev.length > 40 ? prev.slice(-30) : prev;
        return [...filtered, createRaindropStyle()];
      });
    }, 800);

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
