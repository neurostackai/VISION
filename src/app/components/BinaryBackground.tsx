"use client";
import React, { useEffect, useRef, useCallback } from "react";

interface BinaryBackgroundProps {
  color?: string;
  fontSize?: number;
  speed?: number;
  density?: number;
  opacity?: number;
}

export default function BinaryBackground({
  color = "#00da00",
  fontSize = 14,
  speed = 1000,
  density = 0.5,
  opacity = 0.15,
}: BinaryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<
    { value: string; active: boolean; brightness: number }[][]
  >([]);

  const initializeGrid = useCallback(
    (cols: number, rows: number) => {
      const grid = [];
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          row.push({
            value: Math.random() > 0.5 ? "0" : "1",
            active: Math.random() < density,
            brightness: Math.random(),
          });
        }
        grid.push(row);
      }
      return grid;
    },
    [density]
  );

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      grid: { value: string; active: boolean; brightness: number }[][]
    ) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = grid[0].length;
      const rows = grid.length;

      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = grid[i][j];
          if (cell.active) {
            const alpha = cell.brightness * opacity;
            ctx.fillStyle = `${color}${Math.round(alpha * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.shadowBlur = 5;
            ctx.shadowColor = color;
            ctx.fillText(
              cell.value,
              j * fontSize + fontSize / 2,
              i * fontSize + fontSize
            );
          }
        }
      }
    },
    [color, fontSize, opacity]
  );

  const updateGrid = useCallback(
    (grid: typeof cellsRef.current) => {
      return grid.map((row) =>
        row.map((cell) => ({
          value: Math.random() > 0.5 ? "0" : "1",
          active: Math.random() < density,
          brightness: Math.random(),
        }))
      );
    },
    [density]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const cols = Math.ceil(rect.width / fontSize);
      const rows = Math.ceil(rect.height / fontSize);

      cellsRef.current = initializeGrid(cols, rows);
    };

    setupCanvas();

    let animationFrameId: number;
    let lastUpdate = 0;

    const animate = (timestamp: number) => {
      if (timestamp - lastUpdate > speed) {
        cellsRef.current = updateGrid(cellsRef.current);
        lastUpdate = timestamp;
      }

      draw(ctx, canvas, cellsRef.current);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [draw, initializeGrid, updateGrid, fontSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: "rgb(0, 0, 0)" }}
    />
  );
}
