
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp,
  onSnapshot 
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
  isActive: boolean;
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
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Limpar listener anterior se houver
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Iniciar escuta em tempo real do documento do usuário para detectar desativação imediata
      const userRef = doc(db, 'users', firebaseUser.uid);
      
      unsubscribeDoc = onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          
          // Se o administrador desativar o usuário, força o logout
          if (data.isActive === false) {
            signOut(auth);
            setUser(null);
            router.push('/');
            return;
          }

          const session: UserSession = {
            username: data.username || 'Desconhecido',
            role: data.role || 'user',
            isActive: !!data.isActive,
            uid: firebaseUser.uid
          };
          setUser(session);
        } else {
          // Se o documento sumiu, mata a sessão
          signOut(auth);
          setUser(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Erro na escuta do perfil:", error);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, [auth, db, router]);

  const login = async (username: string, password: string) => {
    try {
      const email = `${username.toLowerCase()}@kizaru.ffz`;
      
      let authResult;
      try {
        authResult = await signInWithEmailAndPassword(auth, email, password);
      } catch (e: any) {
        // Bootstrap do Admin Mestre
        if (username.toLowerCase() === 'kizarudono' && password === '052006') {
          try {
            authResult = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', authResult.user.uid), {
              username: 'kizarudono',
              role: 'admin',
              isActive: true,
              createdAt: serverTimestamp()
            });
          } catch (createErr: any) {
            return { success: false, message: 'Erro ao inicializar sistema administrativo.' };
          }
        } else {
          return { success: false, message: 'Credenciais inválidas.' };
        }
      }

      const userRef = doc(db, 'users', authResult.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await signOut(auth);
        return { success: false, message: 'Perfil não encontrado.' };
      }

      const userData = userSnap.data();
      if (!userData.isActive) {
        await signOut(auth);
        return { success: false, message: 'Acesso negado: Licença desativada.' };
      }

      return { success: true, message: 'Acesso autorizado.', role: userData.role };
    } catch (error: any) {
      return { success: false, message: 'Erro de comunicação.' };
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
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
