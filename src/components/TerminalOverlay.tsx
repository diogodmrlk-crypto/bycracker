
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CheckCircle2, Loader2, XCircle, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  isDeactivating?: boolean;
}

const ACTIVATION_SCRIPTS = [
  "Conectando ao módulo...",
  "Verificando integridade...",
  "Injetando parâmetros...",
  "Sincronizando sistema...",
  "Aplicando otimização...",
  "Sistema pronto.",
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

  const scripts = useMemo(() => 
    isDeactivating ? DEACTIVATION_SCRIPTS : ACTIVATION_SCRIPTS, 
  [isDeactivating]);

  useEffect(() => {
    if (!isOpen) {
      setLines([]);
      setIsFinished(false);
      processStartedRef.current = false;
      return;
    }

    if (processStartedRef.current) return;
    processStartedRef.current = true;

    let currentIndex = 0;
    // Ajustado para durar entre 3-5 segundos totais
    const lineInterval = isDeactivating ? 600 : 700;

    const interval = setInterval(() => {
      if (currentIndex < scripts.length) {
        setLines(prev => [...prev, scripts[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          // Aguarda 2 segundos após concluir para fechar automaticamente
          setTimeout(() => {
            onComplete();
          }, 2000);
        }, 500);
      }
    }, lineInterval);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, scripts, onComplete, isDeactivating]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-primary/30 rounded-[2.5rem] p-8 font-mono text-sm shadow-[0_0_60px_rgba(196,76,255,0.1)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Efeito de Scanline Interno */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        
        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Terminal className="w-3 h-3 text-primary/60" />
            <span className="text-[10px] text-primary/60 uppercase tracking-[0.3em] font-black italic">
              Kizaru Kernel Protocol
            </span>
          </div>
        </div>
        
        <div className="space-y-4 min-h-[220px]">
          {lines.map((line, i) => (
            <div key={i} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
              <span className="text-primary font-black opacity-40 select-none">root@kizaru:~#</span>
              <span className={cn(
                "leading-relaxed tracking-tight",
                i === lines.length - 1 && !isFinished ? "text-white" : "text-white/60"
              )}>
                {line}
              </span>
            </div>
          ))}
          
          {!isFinished && (
            <div className="flex items-center gap-3 text-primary/40 pl-1">
              <Loader2 size={12} className="animate-spin" />
              <span className="text-[10px] uppercase tracking-widest font-bold animate-pulse">Processando...</span>
            </div>
          )}

          {isFinished && (
            <div className={cn(
              "mt-8 flex items-center gap-4 animate-in zoom-in-95 duration-700 p-5 rounded-[1.5rem] border backdrop-blur-md",
              isDeactivating 
                ? "text-red-400 bg-red-400/5 border-red-400/20 shadow-[0_0_20px_rgba(248,113,113,0.1)]" 
                : "text-green-400 bg-green-400/5 border-green-400/20 shadow-[0_0_20px_rgba(74,222,128,0.1)]"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center",
                isDeactivating ? "bg-red-500/10" : "bg-green-500/10"
              )}>
                {isDeactivating ? <XCircle size={24} /> : <CheckCircle2 size={24} />}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60 mb-1">Status Final</span>
                <span className="font-black uppercase tracking-widest text-sm italic">
                  {isDeactivating ? "Módulo Desativado" : "✔ Ativação concluída"}
                </span>
              </div>
            </div>
          )}
          
          {!isFinished && (
            <div className="w-1.5 h-4 bg-primary/40 animate-pulse mt-1 ml-1" />
          )}
        </div>

        {/* Rodapé Decorativo do Terminal */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between opacity-20">
          <span className="text-[8px] font-bold tracking-widest uppercase">Encryption: AES-256</span>
          <span className="text-[8px] font-bold tracking-widest uppercase">Port: 0x7FFZ</span>
        </div>
      </div>
    </div>
  );
}
