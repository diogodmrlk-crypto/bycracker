"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import { GlowButton } from '@/components/GlowButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';
import { Loader2, User, Lock, ShieldCheck, ShieldAlert } from 'lucide-react';
import { HackerBackground } from '@/components/HackerBackground';
import { cn } from '@/lib/utils';

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
      router.push('/dashboard');
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
      toast({ 
        title: "Acesso Autorizado", 
        description: "Bem-vindo ao Headtrick Kizaru.",
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      setIsLoading(false);
      setLoginStatus('error');
      toast({ 
        title: "Acesso Negado", 
        description: result.message,
        variant: "destructive"
      });
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
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Título com Glitch */}
        <div className="text-center space-y-1 mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic text-primary neon-text-purple animate-glitch">
            HEADTRICK KIZARU
          </h1>
          <p className="text-primary/60 text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase">
            PERFORMANCE PREMIUM
          </p>
        </div>

        {/* Card de Login Glassmorphism */}
        <div className="glass-card neon-border-animated p-8 sm:p-10 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ShieldCheck className="w-24 h-24 text-primary" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[10px] uppercase tracking-widest text-primary/70 font-black ml-1">
                  Identificação do Usuário
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="username"
                    placeholder="Seu usuário premium"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-black/40 border-primary/20 focus:border-primary focus:ring-primary/20 h-14 pl-12 rounded-2xl transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" title="Password" className="text-[10px] uppercase tracking-widest text-primary/70 font-black ml-1">
                  Código de Acesso
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/40 border-primary/20 focus:border-primary focus:ring-primary/20 h-14 pl-12 rounded-2xl transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <GlowButton 
              type="submit" 
              className={cn(
                "w-full text-sm font-black tracking-widest h-14 rounded-2xl transition-all duration-500 uppercase italic",
                loginStatus === 'success' ? "bg-green-500 shadow-green-500/50" : 
                loginStatus === 'error' ? "bg-red-500 shadow-red-500/50" : ""
              )}
              disabled={isLoading || loginStatus === 'success'}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AUTENTICANDO...
                </div>
              ) : loginStatus === 'success' ? (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  ACESSO AUTORIZADO
                </div>
              ) : loginStatus === 'error' ? (
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  ACESSO NEGADO
                </div>
              ) : "ENTRAR NO SISTEMA"}
            </GlowButton>
          </form>

          {/* Rodapé Interno do Card */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Servidores Online</span>
            </div>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">v2.0 Premium</span>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 font-bold tracking-[0.2em] uppercase">
          © 2024 Headtrick Kizaru Team • Advanced Security
        </p>
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