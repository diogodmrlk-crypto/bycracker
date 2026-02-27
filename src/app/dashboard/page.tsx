"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import { GlowButton } from '@/components/GlowButton';
import { TerminalOverlay } from '@/components/TerminalOverlay';
import { Menu, X, LogOut, LayoutGrid, Rocket, Zap, Target, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

function DashboardContent() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleAction = () => {
    setActiveAnimation(true);
  };

  const openFreeFire = () => {
    const deepLink = 'freefire://';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.dts.freefireth';
    
    // Try to open deep link
    window.location.href = deepLink;
    
    // Fallback if not opened within 1.5 seconds
    setTimeout(() => {
      if (document.hasFocus()) {
        window.location.href = playStoreUrl;
      }
    }, 1500);
  };

  if (loading || !user) {
    return null;
  }

  const actions = [
    { title: "Remover Tremedeira", icon: <Target className="w-8 h-8 mb-2 text-primary" /> },
    { title: "Estabilizar Mira", icon: <Zap className="w-8 h-8 mb-2 text-primary" /> },
    { title: "Sensi Sem Congelamento", icon: <Rocket className="w-8 h-8 mb-2 text-primary" /> },
    { title: "Clean", icon: <Trash2 className="w-8 h-8 mb-2 text-primary" /> }
  ];

  return (
    <div className="min-h-screen bg-[#171418] flex flex-col">
      {/* Header */}
      <header className="h-16 px-6 border-b border-primary/20 flex items-center justify-between sticky top-0 bg-[#171418]/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black italic">H</div>
          <span className="text-lg font-bold truncate max-w-[150px]">Olá, {user.username}</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8 pb-24">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black italic text-primary neon-text-purple tracking-tighter">
            PAINEL HEADTRICK KIZARU
          </h2>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
            Aumente seu desempenho agora
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={handleAction}
              className="relative group p-8 rounded-2xl bg-card/40 border border-primary/20 flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(196,76,255,0.05)] hover:shadow-[0_0_20px_rgba(196,76,255,0.2)] hover:border-primary/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {action.icon}
              <span className="font-bold text-center group-hover:text-primary transition-colors">{action.title}</span>
            </button>
          ))}
        </div>

        {/* Extra Button */}
        <div className="pt-4">
          <GlowButton 
            onClick={openFreeFire}
            variant="accent"
            className="w-full flex items-center justify-center gap-3 bg-[#ACE4FF] text-[#171418] border-none shadow-[0_0_20px_rgba(172,228,255,0.3)] hover:shadow-[0_0_30px_rgba(172,228,255,0.5)]"
          >
            <LayoutGrid className="w-5 h-5" />
            ABRIR FREE FIRE
          </GlowButton>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="p-8 text-center border-t border-primary/10 bg-black/20">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          Powered by Headtrick Engine v4.2.0
        </p>
      </footer>

      {/* Menu Drawer */}
      <div className={`fixed inset-0 z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-[#171418] border-l border-primary/20 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <span className="font-black italic text-primary">KIZARU</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-1">
              <X className="w-6 h-6 text-primary" />
            </button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-8">
              <p className="text-[10px] uppercase text-primary/60 font-bold tracking-widest mb-1">Status da Conta</p>
              <p className="text-sm font-bold text-green-400">ATIVADO ✅</p>
            </div>
          </div>

          <button 
            onClick={logout}
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors w-full mt-auto"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Sair do Painel</span>
          </button>
        </div>
      </div>

      <TerminalOverlay 
        isOpen={activeAnimation} 
        onComplete={() => setActiveAnimation(false)} 
      />
      <Toaster />
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
