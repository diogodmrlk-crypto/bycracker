
"use client";

import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const db = useFirestore();

  // Queries para estatísticas
  const allUsersQuery = useMemoFirebase(() => collection(db, 'users'), [db]);
  const activeUsersQuery = useMemoFirebase(() => query(collection(db, 'users'), where('isActive', '==', true)), [db]);
  const blockedUsersQuery = useMemoFirebase(() => query(collection(db, 'users'), where('isActive', '==', false)), [db]);

  const { data: allUsers } = useCollection(allUsersQuery);
  const { data: activeUsers } = useCollection(activeUsersQuery);
  const { data: blockedUsers } = useCollection(blockedUsersQuery);

  const stats = [
    { 
      label: 'Total de Usuários', 
      value: allUsers?.length || 0, 
      icon: <Users size={24} />, 
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    { 
      label: 'Usuários Ativos', 
      value: activeUsers?.length || 0, 
      icon: <ShieldCheck size={24} />, 
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    { 
      label: 'Usuários Bloqueados', 
      value: blockedUsers?.length || 0, 
      icon: <ShieldAlert size={24} />, 
      color: 'text-red-400',
      bg: 'bg-red-400/10'
    },
    { 
      label: 'Módulos em Uso', 
      value: (allUsers?.filter(u => u.removerTremedeiraActive || u.estabilizarMiraActive).length || 0), 
      icon: <Activity size={24} />, 
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10'
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase neon-text-purple mb-2">Dashboard Administrativo</h1>
        <p className="text-muted-foreground font-medium">Visão geral da performance e licenciamento do Headtrick Kizaru.</p>
      </header>

      {/* Grid de Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 flex items-center gap-5">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-black italic tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Atividade Recente e Avisos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3">
                <TrendingUp className="text-primary" />
                Usuários Recentes
              </h3>
            </div>
            
            <div className="space-y-4">
              {allUsers?.slice(0, 5).map((user, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user.username}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">{user.role || 'user'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-1 rounded-lg",
                      user.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    )}>
                      {user.isActive ? 'Ativo' : 'Bloqueado'}
                    </span>
                  </div>
                </div>
              ))}
              {(!allUsers || allUsers.length === 0) && (
                <p className="text-center py-20 text-muted-foreground font-medium italic">Nenhum usuário cadastrado.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
            <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3 mb-6">
              <Clock className="text-primary" />
              Sistema
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Versão do Kernel</p>
                <p className="text-sm font-bold italic">Kizaru v3.0.1 Stable</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-1">Database Sync</p>
                <p className="text-sm font-bold italic">Real-time Connected</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-primary/20 bg-primary/5">
            <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4">Aviso Global</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">
              Envie mensagens instantâneas para todos os usuários ativos no painel.
            </p>
            <textarea 
              placeholder="Digite o aviso..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-medium focus:border-primary transition-all outline-none min-h-[100px] mb-4"
            />
            <button className="w-full py-3 bg-primary rounded-xl text-xs font-black uppercase tracking-widest italic shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Disparar Aviso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
