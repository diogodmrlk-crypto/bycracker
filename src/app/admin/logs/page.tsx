
"use client";

import React from 'react';
import { History, Shield, Zap, UserCheck, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLogs() {
  // Logs mockados para preencher a interface visualmente
  const mockLogs = [
    { type: 'auth', msg: 'Admin kizarudono acessou o painel', time: 'Há 2 min', user: 'kizarudono', status: 'success' },
    { type: 'module', msg: 'Módulo Removido: Remetereira ativado', time: 'Há 5 min', user: 'premium_user', status: 'active' },
    { type: 'security', msg: 'Tentativa de acesso bloqueada (IP: 192.168.1.1)', time: 'Há 15 min', user: 'unknown', status: 'blocked' },
    { type: 'user', msg: 'Nova licença Vitalícia gerada', time: 'Há 1 hora', user: 'admin', status: 'success' },
    { type: 'auth', msg: 'Login efetuado com sucesso', time: 'Há 2 horas', user: 'ffz_pro', status: 'success' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase neon-text-purple mb-2">Logs do Kernel</h1>
        <p className="text-muted-foreground font-medium">Histórico em tempo real de todas as ações e eventos do sistema.</p>
      </header>

      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
        <div className="p-8 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
            <Terminal className="text-primary" size={18} />
            Monitor de Eventos (Live)
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase text-green-400 tracking-widest">Sincronizado</span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {mockLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all group">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                log.type === 'auth' ? "bg-blue-500/10 text-blue-400" :
                log.type === 'module' ? "bg-primary/10 text-primary" :
                log.type === 'security' ? "bg-red-500/10 text-red-400" :
                "bg-green-500/10 text-green-400"
              )}>
                {log.type === 'auth' ? <UserCheck size={18} /> :
                 log.type === 'module' ? <Zap size={18} /> :
                 log.type === 'security' ? <Shield size={18} /> :
                 <History size={18} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{log.msg}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">{log.user}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[10px] font-medium text-muted-foreground/60 italic">{log.time}</span>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className={cn(
                  "text-[9px] font-black uppercase px-2 py-1 rounded-lg",
                  log.status === 'success' ? "bg-green-500/10 text-green-400" :
                  log.status === 'active' ? "bg-primary/10 text-primary" :
                  "bg-red-500/10 text-red-400"
                )}>
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 text-center border-t border-white/5">
          <button className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
            Carregar histórico completo
          </button>
        </div>
      </div>
    </div>
  );
}
