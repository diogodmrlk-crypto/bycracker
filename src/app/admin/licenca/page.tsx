
"use client";

import React from 'react';
import { Key, ShieldCheck, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function AdminLicenses() {
  const db = useFirestore();
  const usersQuery = useMemoFirebase(() => collection(db, 'users'), [db]);
  const { data: users, isLoading } = useCollection(usersQuery);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase neon-text-purple mb-2">Gestão de Licenças</h1>
        <p className="text-muted-foreground font-medium">Controle de planos, expirações e chaves de acesso.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-[2rem] border-primary/20 bg-primary/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Status Geral</p>
              <p className="text-lg font-black italic">Kernel Ativo</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-[2rem] border-green-500/20 bg-green-500/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
              <Key size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Licenças Ativas</p>
              <p className="text-lg font-black italic">{users?.filter(u => u.isActive).length || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-[2rem] border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Expiradas</p>
              <p className="text-lg font-black italic">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
        <div className="p-8 border-b border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
            <Clock className="text-primary" size={18} />
            Monitoramento de Expiração
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-8 py-4 text-left">Usuário</th>
                <th className="px-8 py-4 text-left">Plano</th>
                <th className="px-8 py-4 text-left">Expiração</th>
                <th className="px-8 py-4 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{user.username}</span>
                      <span className="text-[9px] text-muted-foreground/40 font-mono">{user.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs font-bold uppercase italic">Vitalício</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Calendar size={14} />
                      Never Expires
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-1 rounded-lg",
                      user.isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                    )}>
                      {user.isActive ? 'Valid' : 'Revoked'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
