
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
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
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
        } else {
          // Caso o usuário exista no Auth mas não no Firestore (raro, mas possível)
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao sincronizar sessão:", error);
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
        // Tenta o login normal
        authResult = await signInWithEmailAndPassword(auth, email, password);
      } catch (e: any) {
        // Se for o admin mestre e não existir, cria ele
        if (username.toLowerCase() === 'kizarudono' && password === '171') {
          try {
            authResult = await createUserWithEmailAndPassword(auth, email, password);
            // Cria o documento no Firestore IMEDIATAMENTE para evitar erro de permissão no onAuthStateChanged
            await setDoc(doc(db, 'users', authResult.user.uid), {
              username: 'kizarudono',
              role: 'admin',
              isActive: true,
              createdAt: serverTimestamp()
            });
          } catch (createErr: any) {
            console.error("Erro no bootstrap admin:", createErr);
            return { success: false, message: 'Erro ao inicializar sistema.' };
          }
        } else {
          return { success: false, message: 'Credenciais inválidas.' };
        }
      }

      // Após login/criação, verifica se o perfil existe e está ativo no Firestore
      const userRef = doc(db, 'users', authResult.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { success: false, message: 'Perfil não encontrado no sistema.' };
      }

      const userData = userSnap.data();
      if (!userData.isActive) {
        await signOut(auth);
        return { success: false, message: 'Esta licença foi desativada.' };
      }

      return { success: true, message: 'Acesso autorizado.', role: userData.role };
    } catch (error: any) {
      console.error("Login Error:", error);
      return { success: false, message: 'Erro na comunicação com o servidor.' };
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
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
