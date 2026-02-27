
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { getAuth, signInAnonymously } from 'firebase/auth';

interface UserSession {
  username: string;
  role: 'admin' | 'user';
  ativo: boolean;
  uid: string;
}

interface AuthContextType {
  user: UserSession | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string; role?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = useFirestore();
  const auth = getAuth();

  useEffect(() => {
    const savedUser = localStorage.getItem('hk_session');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (!auth.currentUser) {
        signInAnonymously(auth).catch(console.error);
      }
    }
    setLoading(false);
  }, [auth]);

  const login = async (username: string, password: string) => {
    try {
      await signInAnonymously(auth);

      // Bypass Admin Principal
      if (username === 'kizarudono' && password === '171') {
        const adminSession: UserSession = { 
          username: 'kizarudono', 
          role: 'admin', 
          ativo: true,
          uid: 'admin_fixed'
        };
        setUser(adminSession);
        localStorage.setItem('hk_session', JSON.stringify(adminSession));
        return { success: true, message: 'Admin autorizado.', role: 'admin' };
      }

      // Bypass Legacy Admin
      if (username === 'kizaru' && password === '171') {
        const adminSession: UserSession = { 
          username: 'kizaru', 
          role: 'admin', 
          ativo: true,
          uid: 'kizaru_legacy'
        };
        setUser(adminSession);
        localStorage.setItem('hk_session', JSON.stringify(adminSession));
        return { success: true, message: 'Admin legado autorizado.', role: 'admin' };
      }

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

      if (userData.isActive === false) {
        return { success: false, message: 'Licença desativada.' };
      }

      const userSession: UserSession = { 
        username: userData.username, 
        role: userData.role || 'user', 
        ativo: userData.isActive,
        uid: querySnapshot.docs[0].id
      };
      
      setUser(userSession);
      localStorage.setItem('hk_session', JSON.stringify(userSession));
      return { success: true, message: 'Login realizado.', role: userSession.role };
    } catch (error: any) {
      console.error("Auth Error:", error);
      return { success: false, message: 'Erro de conexão.' };
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
