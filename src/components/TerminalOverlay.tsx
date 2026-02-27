"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface TerminalOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function TerminalOverlay({ isOpen, onComplete }: TerminalOverlayProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const scripts = [
    "Iniciando processo...",
    "Aplicando configurações...",
    "Finalizando...",
  ];

  useEffect(() => {
    if (isOpen) {
      setLines([]);
      setIsFinished(false);
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < scripts.length) {
          setLines(prev => [...prev, scripts[index]]);
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(() => {
              onComplete();
            }, 1000);
          }, 500);
        }
      }, 700);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-6">
      <div className="w-full max-w-md bg-[#171418] border border-primary/30 rounded-lg p-6 font-mono text-sm shadow-[0_0_30px_rgba(196,76,255,0.2)]">
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        
        <div className="space-y-2">
          {lines.map((line, i) => (
            <div key={i} className="text-primary/90 flex items-center gap-2">
              <span className="text-secondary">$</span>
              {line}
            </div>
          ))}
          
          {isFinished && (
            <div className="text-green-400 mt-4 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 size={18} />
              Ativado com sucesso ✔
            </div>
          )}
          
          {!isFinished && (
            <div className="w-2 h-5 bg-primary/50 animate-pulse mt-1" />
          )}
        </div>
      </div>
    </div>
  );
}
