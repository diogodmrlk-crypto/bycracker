"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import { GlowButton } from '@/components/GlowButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';
import { Loader2, User, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Importação dinâmica para evitar erro de hidratação
const HackerBackground = dynamic(() => import('@/components/HackerBackground').then(mod => mod.HackerBackground), { 
  ssr: false 
});

function LoginContent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { login, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') router.push('/admin');
      else router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({ 
        title: "Campos vazios", 
        description: "Por favor, preencha usuário e senha.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setLoginStatus('idle');
    
    const result = await login(username, password);
    
    if (result.success) {
      setLoginStatus('success');
      toast({ title: "Autorizado", description: result.message });
      setTimeout(() => {
        if (result.role === 'admin') router.push('/admin');
        else router.push('/dashboard');
      }, 1000);
    } else {
      setIsLoading(false);
      setLoginStatus('error');
      toast({ title: "Negado", description: result.message, variant: "destructive" });
      setTimeout(() => setLoginStatus('idle'), 3000);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <HackerBackground />
      <div className="w-full max-w-md space-y-10 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter italic text-primary neon-text-purple animate-glitch">
            HEADTRICK KIZARU
          </h1>
          <p className="text-primary/70 text-[10px] sm:text-xs font-black tracking-[0.5em] uppercase opacity-80">
            PERFORMANCE PREMIUM
          </p>
        </div>

        <div className="glass-card neon-border-animated p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/5 to-transparent rotate-45 pointer-events-none group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-1000" />
          
          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[10px] uppercase tracking-widest text-primary/80 font-black ml-1">user id</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <Input
                    id="username"
                    placeholder="ID de Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-black/40 border-primary/20 focus:border-primary focus:ring-primary/20 h-14 pl-12 rounded-2xl transition-all duration-500 placeholder:text-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" title="Password" className="text-[10px] uppercase tracking-widest text-primary/80 font-black ml-1">Código de Acesso</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/40 border-primary/20 focus:border-primary focus:ring-primary/20 h-14 pl-12 rounded-2xl transition-all duration-500 placeholder:text-white/10"
                  />
                </div>
              </div>
            </div>

            <GlowButton 
              type="submit" 
              className={cn(
                "w-full text-sm font-black tracking-[0.2em] h-16 rounded-2xl transition-all duration-500 uppercase italic",
                loginStatus === 'success' ? "bg-green-500 shadow-green-500/50" : 
                loginStatus === 'error' ? "bg-red-500 shadow-red-500/50" : "bg-primary shadow-primary/20"
              )}
              disabled={isLoading || loginStatus === 'success'}
            >
              {isLoading ? "AUTENTICANDO..." : loginStatus === 'success' ? "ACESSO AUTORIZADO" : loginStatus === 'error' ? "ACESSO NEGADO" : "ENTRAR NO SISTEMA"}
            </GlowButton>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Servidores Ativos</span>
            </div>
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Kizaru v3.0 Admin</span>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}
