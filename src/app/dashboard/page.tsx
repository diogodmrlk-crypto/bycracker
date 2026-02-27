
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import { ModuleCard } from '@/components/ModuleCard';
import { TerminalOverlay } from '@/components/TerminalOverlay';
import { GlowButton } from '@/components/GlowButton';
import { 
  LogOut, 
  Target, 
  Zap, 
  Rocket, 
  Trash2, 
  Cpu,
  Activity,
  Gamepad2,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const HackerBackground = dynamic(() => import('@/components/HackerBackground').then(mod => mod.HackerBackground), { 
  ssr: false 
});

function DashboardContent() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const firestore = useFirestore();
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userData, isLoading: isDocLoading } = useDoc<any>(userDocRef);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleToggle = useCallback((moduleKey: string) => {
    if (!userDocRef || !userData || !userData.isActive) return;
    setActiveModule(moduleKey);
  }, [userDocRef, userData]);

  const onAnimationComplete = useCallback(() => {
    if (!activeModule || !userDocRef) {
      setActiveModule(null);
      return;
    }
    
    const fieldName = `${activeModule}Active`;
    const currentStatus = userData ? !!userData[fieldName] : false;
    const newStatus = !currentStatus;
    
    setDocumentNonBlocking(userDocRef, {
      [fieldName]: newStatus,
      lastUpdate: new Date().toISOString()
    }, { merge: true });
    
    setTimeout(() => {
      setActiveModule(null);
    }, 100);
  }, [activeModule, userDocRef, userData]);

  const handleLogout = useCallback(() => {
    if (userDocRef) {
      setDocumentNonBlocking(userDocRef, {
        removerTremedeiraActive: false,
        estabilizarMiraActive: false,
        sensiSemCongelamentoActive: false,
        cleanActive: false,
        lastUpdate: new Date().toISOString()
      }, { merge: true });
    }
    logout();
  }, [userDocRef, logout]);

  const handleOpenFreeFire = useCallback(() => {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isMobile = isAndroid || isIOS;

    if (isMobile) {
      // Protocolo universal para tentar abrir o app
      const start = Date.now();
      window.location.href = 'freefire://';
      
      // Fallback caso o app não esteja instalado ou não abra em 2.5s
      setTimeout(() => {
        if (Date.now() - start < 3000) {
          window.location.href = 'https://ff.garena.com/pt/';
        }
      }, 2500);
    } else {
      // Desktop: Abre o site oficial em nova aba
      window.open('https://ff.garena.com/pt/', '_blank');
    }
  }, []);

  if (authLoading || (user && isDocLoading && !userData)) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <HackerBackground />
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 animate-pulse">
          Acessando Kernel de Segurança...
        </p>
      </div>
    );
  }

  if (user && userData && !userData.isActive) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <HackerBackground />
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
        <h1 className="text-2xl font-black italic uppercase text-white mb-2">Acesso Revogado</h1>
        <p className="text-muted-foreground text-sm max-w-xs mb-8">Sua licença expirou ou foi desativada pelo administrador.</p>
        <button onClick={logout} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">
          Sair do Sistema
        </button>
      </div>
    );
  }

  if (!user || !userData) return null;

  const modules = [
    { id: "removerTremedeira", title: "Remover Tremedeira", description: "Reduz micro oscilações da mira.", icon: <Target className="w-6 h-6" /> },
    { id: "estabilizarMira", title: "Estabilizar Mira", description: "Ajusta suavização de tracking.", icon: <Zap className="w-6 h-6" /> },
    { id: "sensiSemCongelamento", title: "Sensi Sem Congelamento", description: "Remove travamentos durante flick.", icon: <Rocket className="w-6 h-6" /> },
    { id: "clean", title: "Clean", description: "Otimiza resposta do sistema.", icon: <Trash2 className="w-6 h-6" /> }
  ];

  const activeCount = modules.filter(m => userData && userData[`${m.id}Active`]).length;
  const isEngineRunning = activeCount > 0;

  return (
    <div className="min-h-screen flex flex-col relative">
      <HackerBackground />

      <header className="h-20 px-6 flex items-center justify-between sticky top-0 bg-black/20 backdrop-blur-xl border-b border-white/5 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black italic shadow-lg shadow-primary/20">
            H
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-primary/60 tracking-widest leading-none mb-1">
              {userData.role === 'admin' ? 'Super Admin' : 'Usuário Premium'}
            </p>
            <p className="text-sm font-bold truncate max-w-[120px]">{userData.username}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEngineRunning && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Engine On</span>
            </div>
          )}
          <button onClick={handleLogout} className="p-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 max-w-2xl mx-auto w-full pb-32">
        <section className="glass-card p-6 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu className="w-24 h-24 text-primary" /></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700", isEngineRunning ? "bg-primary shadow-[0_0_20px_rgba(196,76,255,0.4)]" : "bg-white/5")}>
                <Activity className={cn("w-6 h-6", isEngineRunning ? "text-white" : "text-muted-foreground/40")} />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Engine Status</h2>
                <p className={cn("text-xl font-black italic tracking-tighter uppercase transition-all duration-700", isEngineRunning ? "text-primary neon-text-purple" : "text-white/40")}>
                  {isEngineRunning ? "Headtrick Engine Running" : "Engine Standby"}
                </p>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <div className="flex-1 glass-card bg-white/5 rounded-2xl p-3 border-none">
                <p className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-widest mb-1">Módulos Ativos</p>
                <p className="text-lg font-black">{activeCount} / {modules.length}</p>
              </div>
              <div className="flex-1 glass-card bg-white/5 rounded-2xl p-3 border-none">
                <p className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-widest mb-1">Status Global</p>
                <p className={cn("text-lg font-black", isEngineRunning ? "text-green-400" : "text-yellow-400")}>{isEngineRunning ? "Otimizado" : "Pronto"}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modules.map((m) => (
            <ModuleCard
              key={m.id}
              title={m.title}
              description={m.description}
              icon={m.icon}
              isActive={userData ? !!userData[`${m.id}Active`] : false}
              onToggle={() => handleToggle(m.id)}
              isLoading={isDocLoading && !userData}
            />
          ))}
        </div>

        <div className="pt-4">
          <GlowButton 
            onClick={handleOpenFreeFire}
            className="w-full flex items-center justify-center gap-3 py-6 text-xl rounded-[2rem] bg-gradient-to-br from-[#1a0824] to-primary text-white border border-primary/20 shadow-[0_0_30px_rgba(196,76,255,0.2)] hover:shadow-[0_0_50px_rgba(196,76,255,0.4)] transition-all duration-500 uppercase italic tracking-widest font-black"
          >
            <Gamepad2 className="w-7 h-7" />
            ABRIR FREE FIRE
          </GlowButton>
        </div>
      </main>

      <TerminalOverlay 
        isOpen={!!activeModule} 
        onComplete={onAnimationComplete} 
        isDeactivating={activeModule && userData ? !!userData[`${activeModule}Active`] : false}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
