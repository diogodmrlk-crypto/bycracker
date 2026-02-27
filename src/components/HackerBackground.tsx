"use client";

import React from 'react';

export function HackerBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
      {/* Camada 1: Gradiente de Profundidade */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-[#08030a] to-[#120518] opacity-100" />
      
      {/* Camada 2: FFZ Camada Distante (Depth) */}
      <div className="absolute inset-0 ffz-pattern-deep blur-[1px]" />
      
      {/* Camada 3: FFZ Camada Próxima (Glow) */}
      <div className="absolute inset-0 ffz-pattern-front opacity-80" />
      
      {/* Camada 4: Ruído Digital Sutil */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Camada 5: Linhas de Varredura (Scanline) */}
      <div className="scanline" />
      
      {/* Brilhos Digitais (Ambient Glow) */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />

      {/* Partículas Digitais */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary/30 blur-[1px] animate-pulse-soft"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 8 + 's',
              animationDuration: Math.random() * 6 + 4 + 's'
            }}
          />
        ))}
      </div>
    </div>
  );
}