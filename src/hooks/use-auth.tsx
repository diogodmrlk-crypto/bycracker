"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('hk_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: 'Usuário não encontrado.' };
      }

      const userData = querySnapshot.docs[0].data();

      if (userData.password !== password) {
        return { success: false, message: 'Senha incorreta.' };
      }

      if (userData.ativo === false) {
        return { success: false, message: 'Sua licença foi desativada.' };
      }

      const userSession = { username: userData.username, ativo: userData.ativo };
      setUser(userSession);
      localStorage.setItem('hk_session', JSON.stringify(userSession));
      return { success: true, message: 'Login realizado com sucesso.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Ocorreu um erro ao tentar entrar.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hk_session');
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
