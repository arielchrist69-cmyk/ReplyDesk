import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { fetchProfile } from '../lib/api';

export interface AppUser extends User {
  fullName: string;
  company: string;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    company: string
  ) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (u: User) => {
    const profile = await fetchProfile(u.id, u.email ?? '');
    setUser({
      ...u,
      fullName: profile?.full_name || (u.user_metadata?.full_name as string) || '',
      company: profile?.company || (u.user_metadata?.company as string) || '',
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadProfile(data.session.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        (async () => loadProfile(newSession.user))();
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    company: string
  ): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, company },
      },
    });
    if (error) return traduireErreur(error.message);
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        company,
      });
      await loadProfile(data.user);
    }
    return null;
  };

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return traduireErreur(error.message);
    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (session?.user) await loadProfile(session.user);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function traduireErreur(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('already registered') || m.includes('already exists'))
    return 'Un compte existe déjà avec cette adresse e-mail.';
  if (m.includes('invalid login credentials'))
    return 'E-mail ou mot de passe incorrect.';
  if (m.includes('email not confirmed'))
    return 'Votre adresse e-mail n’a pas encore été confirmée.';
  if (m.includes('password') && m.includes('at least'))
    return 'Le mot de passe doit contenir au moins 6 caractères.';
  if (m.includes('rate limit'))
    return 'Trop de tentatives. Veuillez patienter quelques instants.';
  if (m.includes('unable to validate') || m.includes('network'))
    return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
  return 'Une erreur est survenue. Veuillez réessayer.';
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
