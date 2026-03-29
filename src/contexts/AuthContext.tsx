import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  age: string;
  address: string;
  gender: string;
  bloodGroup: string;
  role: 'patient' | 'doctor' | 'admin' | 'lab';
}

interface AuthContextType {
  user: { uid: string, email: string } | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (profile: UserProfile, uid: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  login: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{uid: string, email: string} | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase Auth state (admin logins via signInWithEmailAndPassword)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Firebase Auth user present — treat as admin
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email ?? '' });
        setUserProfile({
          name: 'Admin',
          phone: '',
          email: firebaseUser.email ?? '',
          age: '',
          address: '',
          gender: '',
          bloodGroup: '',
          role: 'admin',
        });
        setLoading(false);
      } else {
        // No Firebase Auth user — check for specialized sessions
        const patientSession = localStorage.getItem('medicare_patient_session');
        const labSession = localStorage.getItem('medicare_lab_session');
        
        if (patientSession) {
          try {
            const session = JSON.parse(patientSession);
            setUser({ uid: session.id, email: session.email });
            setUserProfile(session);
          } catch { localStorage.removeItem('medicare_patient_session'); }
        } else if (labSession) {
          try {
            const session = JSON.parse(labSession);
            setUser({ uid: session.id, email: session.email });
            setUserProfile(session);
          } catch { localStorage.removeItem('medicare_lab_session'); }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = (profile: UserProfile, uid: string) => {
    setUser({ uid, email: profile.email });
    setUserProfile(profile);
    const storageKey = profile.role === 'lab' ? 'medicare_lab_session' : 'medicare_patient_session';
    localStorage.setItem(storageKey, JSON.stringify({ ...profile, id: uid }));
  };

  const signOut = async () => {
    await firebaseSignOut(auth).catch(() => {});
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('medicare_patient_session');
    localStorage.removeItem('medicare_lab_session');
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
