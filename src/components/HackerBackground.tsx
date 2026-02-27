"use client";

import React from 'react';

export function HackerBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020102]">
      {/* Camada 1: Gradiente de Profundidade - Mais rico */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-[#0a040d] to-[#1a0824] opacity-100" />
      
      {/* Camada 2: ffz Camada Distante (Depth) - Texto ffz visível */}
      <div className="absolute inset-0 ffz-pattern-deep opacity-60 blur-[0.5px]" />
      
      {/* Camada 3: ffz Camada Próxima (Glow) - Texto ffz forte */}
      <div className="absolute inset-0 ffz-pattern-front opacity-90" />
      
      {/* Camada 4: Ruído Digital Sutil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Camada 5: Linhas de Varredura (Scanline) */}
      <div className="scanline" />
      
      {/* Brilhos Digitais (Ambient Glow) */}
      <div className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] bg-primary/20 blur-[180px] rounded-full animate-pulse-soft" />
      <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />

      {/* Partículas Digitais mais visíveis */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary/40 blur-[0.5px] animate-pulse-soft"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
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