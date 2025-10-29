"use client";

import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

interface Branch {
  points: Point[];
  width: number;
  opacity: number;
}

interface LightningBoltProps {
  trigger: boolean;
  delay?: number;
  position?: 'left' | 'center' | 'right';
}

const LightningBolt = ({ trigger, delay = 0, position = 'center' }: LightningBoltProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [progress, setProgress] = useState(0);

  const getStartX = (width: number) => {
    switch (position) {
      case 'left':
        return width * 0.3;
      case 'right':
        return width * 0.7;
      default:
        return width * 0.5;
    }
  };

  const generateBranch = (
    startX: number,
    startY: number,
    endY: number,
    segments: number,
    offset: number,
    depth: number = 0
  ): Point[] => {
    const points: Point[] = [{ x: startX, y: startY }];
    const segmentHeight = (endY - startY) / segments;

    for (let i = 1; i <= segments; i++) {
      const prevPoint = points[i - 1];
      const randomOffset = (Math.random() - 0.5) * offset;
      const x = prevPoint.x + randomOffset;
      const y = startY + segmentHeight * i;
      points.push({ x, y });
    }

    return points;
  };

  const generateLightning = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const startX = getStartX(width);

    const mainBranch = generateBranch(startX, 0, height, 20, 80, 0);
    const allBranches: Branch[] = [{ points: mainBranch, width: 4, opacity: 1 }];

    for (let i = 0; i < 5; i++) {
      const branchPoint = Math.floor(Math.random() * (mainBranch.length - 5)) + 2;
      const start = mainBranch[branchPoint];
      const branchLength = Math.random() * 200 + 100;
      const branchEnd = Math.min(start.y + branchLength, height);

      const sideBranch = generateBranch(
        start.x,
        start.y,
        branchEnd,
        8,
        60,
        1
      );

      allBranches.push({
        points: sideBranch,
        width: 2,
        opacity: 0.7
      });
    }

    setBranches(allBranches);
  };

  const drawLightning = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (branches.length === 0) return;

    branches.forEach((branch) => {
      const visiblePoints = Math.floor(branch.points.length * progress);
      if (visiblePoints < 2) return;

      ctx.shadowBlur = 20;
      ctx.shadowColor = 'hsl(0, 100%, 50%)';
      ctx.strokeStyle = 'hsl(0, 100%, 50%)';
      ctx.lineWidth = branch.width;
      ctx.globalAlpha = branch.opacity * (0.8 + Math.random() * 0.2);

      ctx.beginPath();
      ctx.moveTo(branch.points[0].x, branch.points[0].y);

      for (let i = 1; i < visiblePoints; i++) {
        ctx.lineTo(branch.points[i].x, branch.points[i].y);
      }

      ctx.stroke();

      ctx.shadowBlur = 40;
      ctx.lineWidth = branch.width * 0.3;
      ctx.strokeStyle = 'white';
      ctx.globalAlpha = branch.opacity * 0.9;
      ctx.stroke();
    });
  };

  useEffect(() => {
    if (trigger) {
      setTimeout(() => {
        generateLightning();
        let frame = 0;
        const animate = () => {
          frame++;
          const newProgress = Math.min(frame / 30, 1);
          setProgress(newProgress);

          if (newProgress < 1) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      }, delay);
    }
  }, [trigger, delay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawLightning();
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    drawLightning();
  }, [branches, progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[100]"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default LightningBolt;
