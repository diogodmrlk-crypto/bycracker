"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  isDeactivating?: boolean;
}

const ACTIVATION_SCRIPTS = [
  "Iniciando módulo...",
  "Acessando kernel do sistema...",
  "Aplicando parâmetros de performance...",
  "Otimizando latência de entrada...",
  "Injetando configurações premium...",
];

const DEACTIVATION_SCRIPTS = [
  "Desativando módulo...",
  "Limpando cache de kernel...",
  "Restaurando parâmetros padrão...",
  "Finalizando processos...",
];

export function TerminalOverlay({ isOpen, onComplete, isDeactivating }: TerminalOverlayProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const processStartedRef = useRef(false);

  // Memoize scripts to prevent effect re-triggering
  const scripts = useMemo(() => 
    isDeactivating ? DEACTIVATION_SCRIPTS : ACTIVATION_SCRIPTS, 
  [isDeactivating]);

  useEffect(() => {
    // Reset state when overlay closes
    if (!isOpen) {
      setLines([]);
      setIsFinished(false);
      processStartedRef.current = false;
      return;
    }

    // Prevent multiple executions for the same opening
    if (processStartedRef.current) return;
    processStartedRef.current = true;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < scripts.length) {
        setLines(prev => [...prev, scripts[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          // Wait a bit before calling onComplete to show the success message
          setTimeout(() => {
            onComplete();
          }, 1000);
        }, 500);
      }
    }, 400);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, scripts, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
      <div className="w-full max-w-md bg-[#0d0c0d] border border-primary/40 rounded-[2rem] p-8 font-mono text-sm shadow-[0_0_50px_rgba(196,76,255,0.15)] relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
        
        <div className="flex gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500/40" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
          <div className="w-3 h-3 rounded-full bg-green-500/40" />
          <span className="ml-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Terminal Kizaru v2.0</span>
        </div>
        
        <div className="space-y-3 min-h-[180px]">
          {lines.map((line, i) => (
            <div key={i} className="text-primary/90 flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
              <span className="text-secondary font-bold">$</span>
              <span className="leading-relaxed">{line}</span>
            </div>
          ))}
          
          {!isFinished && (
            <div className="flex items-center gap-3 text-white/40">
              <Loader2 size={14} className="animate-spin" />
              <span className="animate-pulse">Aguardando resposta...</span>
            </div>
          )}

          {isFinished && (
            <div className={cn(
              "mt-6 flex items-center gap-3 animate-in zoom-in-95 duration-500 p-4 rounded-2xl border",
              isDeactivating 
                ? "text-red-400 bg-red-400/5 border-red-400/20" 
                : "text-green-400 bg-green-400/5 border-green-400/20"
            )}>
              {isDeactivating ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
              <span className="font-black uppercase tracking-widest">
                {isDeactivating ? "Módulo Desativado" : "Ativado com sucesso"}
              </span>
            </div>
          )}
          
          {!isFinished && (
            <div className="w-2 h-5 bg-primary/50 animate-pulse mt-1 ml-6" />
          )}
        </div>
      </div>
    </div>
  );
}
