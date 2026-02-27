"use client";

import React from 'react';

export function HackerBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a090a]">
      {/* Camada 1: Base Preta com Gradiente Profundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a090a] to-[#120518]" />
      
      {/* Camada 2: FFZ Animado */}
      <div className="absolute inset-0 ffz-background opacity-40" />
      
      {/* Camada 3: Partículas e Ruído Digital */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Camada 4: Linhas de Varredura e Glow Digital */}
      <div className="scanline" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2" />
      
      {/* Partículas flutuantes sutis */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary/20 blur-[1px] animate-pulse-soft"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
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