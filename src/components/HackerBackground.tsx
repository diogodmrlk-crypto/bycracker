"use client";

import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  width: string;
  height: string;
  top: string;
  left: string;
  delay: string;
  duration: string;
}

export function HackerBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Gerar partículas apenas no cliente para evitar erros de hidratação
    const newParticles = [...Array(8)].map((_, i) => ({
      id: i,
      width: Math.random() * 2 + 1 + 'px',
      height: Math.random() * 4 + 2 + 'px',
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      delay: Math.random() * 5 + 's',
      duration: Math.random() * 4 + 3 + 's'
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020102]">
      {/* Camada 1: Gradiente de Profundidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a040d] to-[#050207] opacity-100" />
      
      {/* Camada 2: Matrix Code Rain - Camada Distante */}
      <div className="absolute inset-0 hacker-code-deep opacity-60 blur-[1px]" />
      
      {/* Camada 3: Matrix Code Rain - Camada Próxima */}
      <div className="absolute inset-0 hacker-code-front opacity-80" />
      
      {/* Camada 4: Ruído Digital Sutil */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Camada 5: Linhas de Varredura */}
      <div className="scanline" />
      
      {/* Brilhos Digitais Ambientais */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/5 blur-[120px] rounded-full animate-pulse-soft" />
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-primary/3 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />

      {/* Partículas Digitais Glitch (Renderizadas apenas no cliente) */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div 
            key={p.id}
            className="absolute rounded-full bg-primary/20 blur-[1px] animate-pulse-soft"
            style={{
              width: p.width,
              height: p.height,
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration
            }}
          />
        ))}
      </div>
    </div>
  );
}
