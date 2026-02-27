"use client";

import React from 'react';

export function HackerBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020102]">
      {/* Camada 1: Gradiente de Profundidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a040d] to-[#050207] opacity-100" />
      
      {/* Camada 2: Matrix Code Rain - Camada Distante (Depth) */}
      <div className="absolute inset-0 hacker-code-deep opacity-60 blur-[1px]" />
      
      {/* Camada 3: Matrix Code Rain - Camada Próxima (Action) */}
      <div className="absolute inset-0 hacker-code-front opacity-90" />
      
      {/* Camada 4: Ruído Digital Sutil */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Camada 5: Linhas de Varredura (Scanline) */}
      <div className="scanline" />
      
      {/* Brilhos Digitais (Ambient Glow) */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/5 blur-[120px] rounded-full animate-pulse-soft" />
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-primary/3 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />

      {/* Partículas Digitais (Glitches) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary/30 blur-[1px] animate-pulse-soft"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 4 + 3 + 's'
            }}
          />
        ))}
      </div>
    </div>
  );
}