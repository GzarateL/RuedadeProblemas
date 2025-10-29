import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export const BouncingBall = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajustar tamaño del canvas al contenedor
    const getSize = () => {
      const el = canvas.parentElement ?? canvas;
      const rect = el.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    };

    getSize();
    const ro = new ResizeObserver(getSize);
    ro.observe(canvas.parentElement ?? canvas);
    window.addEventListener("resize", getSize);

    // Propiedades de la bola
    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 12,
      vx: 4,
      vy: 3,
      color: "#ef4444",
    };

    const particles: Particle[] = [];
    const gravity = 0.3;
    const minSpeed = 2;

    // Crear partículas
    const createParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        maxLife: 30 + Math.random() * 20,
      });
    };

    let frameCount = 0;
    let animationId: number;

    // Loop de animación
    const animate = () => {
      // Limpiar canvas (transparente)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Física de la bola
      ball.vy += gravity;
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Rebotes en los bordes
      if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.vx = -Math.abs(ball.vx);
        if (Math.abs(ball.vx) < minSpeed) ball.vx = -minSpeed;
        createParticle(ball.x, ball.y);
      }
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx = Math.abs(ball.vx);
        if (Math.abs(ball.vx) < minSpeed) ball.vx = minSpeed;
        createParticle(ball.x, ball.y);
      }
      if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy = -Math.abs(ball.vy);
        if (Math.abs(ball.vy) < minSpeed) ball.vy = -minSpeed * 1.5;
        createParticle(ball.x, ball.y);
      }
      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy = Math.abs(ball.vy);
        if (Math.abs(ball.vy) < minSpeed) ball.vy = minSpeed;
        createParticle(ball.x, ball.y);
      }

      // Crear partículas periódicamente
      frameCount++;
      if (frameCount % 3 === 0) {
        createParticle(ball.x, ball.y);
      }

      // Dibujar bola con efecto glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = ball.color;
      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Dibujar partículas con fade out
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const alpha = 1 - p.life / p.maxLife;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", getSize);
      ro.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ borderRadius: "inherit" }}
    />
  );
};
