"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import { GlowButton } from '@/components/GlowButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function LoginContent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      toast({ 
        title: "Erro no login", 
        description: result.message,
        variant: "destructive"
      });
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#171418]">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter italic text-primary neon-text-purple">
            HEADTRICK KIZARU
          </h1>
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Performance Premium
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs uppercase tracking-widest text-primary font-bold">Usuário</Label>
              <Input
                id="username"
                placeholder="Insira seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="Password" className="text-xs uppercase tracking-widest text-primary font-bold">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 h-12"
              />
            </div>
          </div>

          <GlowButton 
            type="submit" 
            className="w-full text-lg h-14"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                ENTRANDO...
              </div>
            ) : "ENTRAR"}
          </GlowButton>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2024 Headtrick Kizaru Team
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
