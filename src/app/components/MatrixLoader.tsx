"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DigitalRainProps {
  isLoading: boolean;
  onComplete: () => void;
}

export default function DigitalRain({
  isLoading,
  onComplete,
}: DigitalRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const characters = "VISION";

    function draw() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const intervalId = setInterval(draw, 33);

    const totalDuration = 10000;
    const startTime = Date.now();

    const progressIntervalId = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min(
        (elapsedTime / totalDuration) * 100,
        100
      );
      setProgress(Math.round(currentProgress));
    }, 100);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      clearInterval(progressIntervalId);
      if (onComplete) onComplete();
    }, totalDuration);

    function handleResize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(intervalId);
      clearInterval(progressIntervalId);
      clearTimeout(timeoutId);
    };
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center px-4">
          <canvas ref={canvasRef} className="absolute w-full h-full" />

          <div className="relative z-10 w-full max-w-md">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-green-500 font-mono mt-2">
              <span>Loading...</span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
