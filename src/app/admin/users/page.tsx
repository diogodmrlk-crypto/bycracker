
"use client";

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2,
  Edit2,
  Lock,
  Calendar
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function AdminUsers() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const usersQuery = useMemoFirebase(() => collection(db, 'users'), [db]);
  const { data: users, isLoading } = useCollection(usersQuery);

  const filteredUsers = users?.filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserStatus = (user: any) => {
    const userRef = doc(db, 'users', user.id);
    setDocumentNonBlocking(userRef, {
      isActive: !user.isActive,
      lastUpdate: new Date().toISOString()
    }, { merge: true });

    toast({
      title: user.isActive ? "Usuário Bloqueado" : "Usuário Ativado",
      description: `O status de ${user.username} foi atualizado.`
    });
  };

  const deleteUser = (user: any) => {
    if (confirm(`Tem certeza que deseja excluir ${user.username}?`)) {
      const userRef = doc(db, 'users', user.id);
      deleteDocumentNonBlocking(userRef);
      toast({
        title: "Usuário Excluído",
        description: `${user.username} foi removido do sistema.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase neon-text-purple mb-2">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground font-medium">Controle total sobre as contas e licenças premium.</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-4 bg-primary rounded-2xl font-black uppercase text-xs tracking-widest italic shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          <UserPlus size={18} />
          Novo Usuário
        </button>
      </header>

      {/* Busca e Filtros */}
      <div className="glass-card p-4 rounded-[1.5rem] border-white/5 flex items-center gap-4">
        <Search className="text-muted-foreground ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por ID de usuário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent outline-none font-bold text-sm placeholder:text-muted-foreground/40"
        />
      </div>

      {/* Lista de Usuários */}
      <div className="glass-card overflow-hidden rounded-[2.5rem] border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Usuário</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Expiração</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black italic">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-bold text-sm">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-1 rounded-lg",
                      user.role === 'admin' ? "bg-primary/10 text-primary" : "bg-white/5 text-muted-foreground"
                    )}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleUserStatus(user)}
                      className={cn(
                        "flex items-center gap-2 text-[9px] font-black uppercase transition-all",
                        user.isActive ? "text-green-400" : "text-red-400"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full", user.isActive ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" : "bg-red-400")} />
                      {user.isActive ? 'Ativo' : 'Bloqueado'}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={14} />
                      <span className="text-xs font-medium italic">Vitalícia</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteUser(user)}
                        className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Acessando Banco de Dados...</p>
            </div>
          )}
          {filteredUsers?.length === 0 && !isLoading && (
            <div className="py-20 text-center space-y-2">
              <ShieldAlert className="mx-auto text-muted-foreground/20" size={48} />
              <p className="text-muted-foreground font-medium italic">Nenhum usuário encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
