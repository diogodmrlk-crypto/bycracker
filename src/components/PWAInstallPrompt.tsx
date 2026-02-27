"use client";

import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, Smartphone, Download, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

export function PWAInstallPrompt() {
  const { user } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado ou em modo standalone
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Capturar o prompt nativo (Android/Chrome)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      checkAndShowModal();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Para iOS, mostramos baseado em lógica de tempo já que não tem o evento acima
    if (isIosDevice && !isStandaloneMode) {
      checkAndShowModal();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const checkAndShowModal = () => {
    const lastPrompt = localStorage.getItem('pwa-prompt-last-date');
    const now = new Date().getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (!lastPrompt || (now - parseInt(lastPrompt) > sevenDays)) {
      // Pequeno delay para não aparecer instantaneamente no login
      setTimeout(() => setShowModal(true), 2000);
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowModal(false);
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-last-date', new Date().getTime().toString());
    setShowModal(false);
  };

  if (!user || isStandalone || !showModal) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm glass-card border-primary/30 rounded-[2.5rem] p-8 relative overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-500">
        <button 
          onClick={handleDismiss}
          className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 animate-pulse-soft">
            <Smartphone size={32} />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-primary neon-text-purple">
              Instalar Painel
            </h3>
            <p className="text-xs text-muted-foreground font-medium px-4">
              Adicione o Headtrick Kizaru à sua tela inicial para acesso instantâneo e melhor performance.
            </p>
          </div>

          {isIos ? (
            <div className="w-full space-y-4 bg-white/5 rounded-3xl p-6 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Instruções para iPhone</p>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <Share size={16} />
                  </div>
                  <span className="text-xs font-bold">1. Toque no botão "Compartilhar"</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                    <PlusSquare size={16} />
                  </div>
                  <span className="text-xs font-bold">2. Role e escolha "Tela Inicial"</span>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleInstallClick}
              className="w-full py-4 bg-primary rounded-2xl font-black uppercase text-xs tracking-widest italic shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              <Download size={18} />
              Instalar Aplicativo
            </button>
          )}

          <button 
            onClick={handleDismiss}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-colors pt-2"
          >
            Agora não, talvez depois
          </button>
        </div>
      </div>
    </div>
  );
}