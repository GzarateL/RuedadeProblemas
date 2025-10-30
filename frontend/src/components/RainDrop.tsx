"use client";

import { useEffect, useState } from "react";

// Genera estilos aleatorios para cada partícula
const createParticleStyle = (): React.CSSProperties => {
  const size = Math.random() * 12 + 6; // 6-18px (partículas pequeñas)
  const left = Math.random() * 100; // 0-100% horizontal
  const duration = Math.random() * 8 + 12; // 12-20 segundos (muy lentas)
  const delay = Math.random() * 5; // 0-5s delay
  const drift = (Math.random() - 0.5) * 30; // Movimiento diagonal suave (-15 a +15)
  const startPosition = Math.random() * 20; // Empezar desde 0-20% del viewport

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    bottom: `${startPosition}%`,
    animation: `float-up ${duration}s ease-in ${delay}s infinite`,
    '--drift': `${drift}px`,
  } as React.CSSProperties;
};

// Componente individual de partícula
const Particle = ({ style }: { style: React.CSSProperties }) => {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        ...style,
        backgroundColor: 'rgba(255, 0, 51, 0.4)',
        filter: 'blur(3px)',
      }}
    />
  );
};

// Componente contenedor de partículas
export function RainEffect() {
  const [particles, setParticles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    // Crear 20 partículas iniciales (densidad baja)
    const initialParticles = Array.from({ length: 20 }, () => createParticleStyle());
    setParticles(initialParticles);

    // Crear nuevas partículas cada 1000ms (menos frecuentes)
    const interval = setInterval(() => {
      setParticles((prev) => {
        // Limitar a 30 partículas máximo para mantener densidad baja
        const filtered = prev.length > 30 ? prev.slice(-20) : prev;
        return [...filtered, createParticleStyle()];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {particles.map((style, index) => (
        <Particle key={`particle-${index}`} style={style} />
      ))}
    </>
  );
}
