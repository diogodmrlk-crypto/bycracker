
"use client";

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2,
  Edit2,
  Calendar,
  Loader2,
  X,
  Lock,
  User as UserIcon,
  AlertTriangle
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminUsers() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');

  const usersQuery = useMemoFirebase(() => collection(db, 'users'), [db]);
  const { data: users, isLoading } = useCollection(usersQuery);

  const filteredUsers = users?.filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    setIsSubmitting(true);
    let secondaryApp;

    try {
      const appName = `Secondary-${Date.now()}`;
      secondaryApp = initializeApp(firebaseConfig, appName);
      const secondaryAuth = getAuth(secondaryApp);

      const email = `${newUsername.toLowerCase()}@kizaru.ffz`;
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, newPassword);
      const uid = userCredential.user.uid;

      await signOut(secondaryAuth);

      await setDoc(doc(db, 'users', uid), {
        username: newUsername,
        role: newRole,
        isActive: true,
        createdAt: serverTimestamp(),
        lastUpdate: new Date().toISOString()
      });

      toast({
        title: "Usuário Criado",
        description: `O acesso para ${newUsername} foi gerado com sucesso.`
      });

      setIsAddModalOpen(false);
      setNewUsername('');
      setNewPassword('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar",
        description: error.message || "Não foi possível registrar o usuário."
      });
    } finally {
      if (secondaryApp) await deleteApp(secondaryApp);
      setIsSubmitting(false);
    }
  };

  const toggleUserStatus = (user: any) => {
    const userRef = doc(db, 'users', user.id);
    updateDocumentNonBlocking(userRef, {
      isActive: !user.isActive,
      lastUpdate: new Date().toISOString()
    });

    toast({
      title: user.isActive ? "Acesso Revogado" : "Acesso Restaurado",
      description: `O status de ${user.username} foi atualizado.`
    });
  };

  const deleteUser = (user: any) => {
    if (confirm(`Atenção: Excluir perfil de ${user.username}? (O login no sistema continuará existindo, use o botão de Bloqueio para impedir o acesso).`)) {
      const userRef = doc(db, 'users', user.id);
      deleteDocumentNonBlocking(userRef);
      toast({
        title: "Perfil Removido",
        description: "Documento excluído. Use o status de 'Bloqueado' para impedir novos acessos.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase neon-text-purple mb-2">Controle de Membros</h1>
          <p className="text-muted-foreground font-medium">Gerencie licenças e permissões de acesso.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-3 px-6 py-4 bg-primary rounded-2xl font-black uppercase text-xs tracking-widest italic shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <UserPlus size={18} />
          Novo Usuário
        </button>
      </header>

      <div className="glass-card p-4 rounded-[1.5rem] border-white/5 flex items-center gap-4">
        <Search className="text-muted-foreground ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Filtrar por nome ou UID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent outline-none font-bold text-sm placeholder:text-muted-foreground/40"
        />
      </div>

      <div className="glass-card overflow-hidden rounded-[2.5rem] border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Usuário</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Papel</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Estado</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Controles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black italic">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{user.username}</span>
                        <span className="text-[9px] text-muted-foreground/40 font-mono truncate max-w-[120px]">{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-1 rounded-lg",
                      user.role === 'admin' ? "bg-primary/10 text-primary border border-primary/20" : "bg-white/5 text-muted-foreground border border-white/5"
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
                      <div className={cn("w-2 h-2 rounded-full", user.isActive ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.4)]")} />
                      {user.isActive ? 'Ativo' : 'Bloqueado'}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => deleteUser(user)}
                        title="Remover perfil do banco"
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
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Sincronizando...</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-black/90 border-primary/20 backdrop-blur-xl rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-primary">Novo Membro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <input 
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold focus:border-primary outline-none transition-all"
                  placeholder="ID do usuário"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Senha / Código</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Papel no Sistema</label>
              <select 
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-primary outline-none transition-all appearance-none"
              >
                <option value="user" className="bg-black text-white">Usuário Comum</option>
                <option value="admin" className="bg-black text-white">Administrador</option>
              </select>
            </div>

            <DialogFooter className="pt-4">
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-4 bg-primary rounded-2xl text-[10px] font-black uppercase tracking-widest italic text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Criar Acesso"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
