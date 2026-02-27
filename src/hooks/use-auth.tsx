
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { getAuth, signInAnonymously } from 'firebase/auth';

interface User {
  username: string;
  ativo: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = useFirestore();
  const auth = getAuth();

  useEffect(() => {
    const savedUser = localStorage.getItem('hk_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      // Garante que o Firebase Auth esteja ativo se houver sessão salva
      if (!auth.currentUser) {
        signInAnonymously(auth).catch(console.error);
      }
    }
    setLoading(false);
  }, [auth]);

  const login = async (username: string, password: string) => {
    try {
      // Inicia sessão anônima no Firebase para satisfazer as regras de segurança
      await signInAnonymously(auth);

      // Bypass para o administrador kizaru
      if (username === 'kizaru' && password === '171') {
        const userSession = { username: 'kizaru', ativo: true };
        setUser(userSession);
        localStorage.setItem('hk_session', JSON.stringify(userSession));
        return { success: true, message: 'Login de administrador realizado com sucesso.' };
      }

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: 'Usuário não encontrado.' };
      }

      const userData = querySnapshot.docs[0].data();

      // Verificação simples de senha
      if (userData.password !== password) {
        return { success: false, message: 'Senha incorreta.' };
      }

      if (userData.isActive === false) {
        return { success: false, message: 'Sua licença foi desativada.' };
      }

      const userSession = { username: userData.username, ativo: userData.isActive };
      setUser(userSession);
      localStorage.setItem('hk_session', JSON.stringify(userSession));
      return { success: true, message: 'Login realizado com sucesso.' };
    } catch (error: any) {
      console.error("Auth Error:", error);
      return { success: false, message: 'Erro ao conectar ao servidor.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hk_session');
    auth.signOut();
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
