
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const data = userSnap.data();
            const session: UserSession = {
              username: data.username || 'Desconhecido',
              role: data.role || 'user',
              ativo: !!data.isActive,
              uid: firebaseUser.uid
            };
            setUser(session);
            localStorage.setItem('hk_session', JSON.stringify(session));
          } else {
            setUser(null);
            localStorage.removeItem('hk_session');
          }
        } else {
          setUser(null);
          localStorage.removeItem('hk_session');
        }
      } catch (error) {
        console.error("Auth state observer error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const login = async (username: string, password: string) => {
    try {
      const email = `${username.toLowerCase()}@kizaru.ffz`;
      
      let authResult;
      try {
        authResult = await signInWithEmailAndPassword(auth, email, password);
      } catch (e: any) {
        // Bootstrap main admin
        if ((username === 'kizarudono' && password === '171') || (username === 'kizaru' && password === '171')) {
          try {
            authResult = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', authResult.user.uid), {
              username: username,
              role: 'admin',
              isActive: true,
              createdAt: serverTimestamp()
            });
          } catch (createErr) {
            return { success: false, message: 'Erro ao inicializar admin.' };
          }
        } else {
          return { success: false, message: 'Credenciais inválidas ou usuário inexistente.' };
        }
      }

      const uid = authResult.user.uid;
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { success: false, message: 'Perfil não configurado no banco de dados.' };
      }

      const userData = userSnap.data();
      if (!userData.isActive) {
        await signOut(auth);
        return { success: false, message: 'Sua licença está desativada.' };
      }

      return { success: true, message: 'Acesso autorizado.', role: userData.role };
    } catch (error: any) {
      console.error("Auth Error:", error);
      return { success: false, message: 'Erro crítico na autenticação.' };
    }
  };

  const logout = () => {
    signOut(auth);
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
