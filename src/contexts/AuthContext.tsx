import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type AppPlan = 'free' | 'starter' | 'pro';

export interface UserProfile {
  plan: AppPlan;
  plan_expires_at: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  effectivePlan: AppPlan;
  isEmailVerified: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildAuthRedirectUrl(flow: 'signup' | 'recovery' | 'email-change') {
  const url = new URL('/auth/callback', window.location.origin);
  url.searchParams.set('flow', flow);
  return url.toString();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getEffectivePlan = (profileRow: UserProfile | null, currentUser: User | null): AppPlan => {
    void currentUser;
    if (!profileRow) return 'free';

    const expiresAt = profileRow.plan_expires_at ? new Date(profileRow.plan_expires_at) : null;
    if (!expiresAt || Number.isNaN(expiresAt.getTime())) return 'free';
    if (expiresAt.getTime() <= Date.now()) return 'free';

    return profileRow.plan;
  };

  const effectivePlan = useMemo(() => getEffectivePlan(profile, user), [profile, user]);
  const isEmailVerified = Boolean(user?.email_confirmed_at);

  useEffect(() => {
    // Load user on mount
    async function loadUser() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('plan, plan_expires_at')
            .eq('id', user.id)
            .maybeSingle();

          setProfile((profileData as UserProfile) || null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    // Set up auth listener - KEEP SIMPLE, avoid any async operations in callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          supabase
            .from('profiles')
            .select('plan, plan_expires_at')
            .eq('id', currentUser.id)
            .maybeSingle()
            .then(({ data }) => {
              setProfile((data as UserProfile) || null);
            });
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: buildAuthRedirectUrl('signup'),
      },
    });
    if (error) throw error;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function signInWithGoogle() {
    const redirectTo = new URL('/', window.location.origin).toString();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });
    if (error) throw error;
  }

  async function resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: buildAuthRedirectUrl('signup'),
      },
    });
    if (error) throw error;
  }

  async function sendPasswordResetEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: buildAuthRedirectUrl('recovery'),
    });
    if (error) throw error;
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }

  async function updateEmail(email: string) {
    const { error } = await supabase.auth.updateUser(
      { email },
      {
        emailRedirectTo: buildAuthRedirectUrl('email-change'),
      }
    );
    if (error) throw error;
  }

  async function refresh() {
    setLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('plan, plan_expires_at')
          .eq('id', currentUser.id)
          .maybeSingle();
        setProfile((profileData as UserProfile) || null);
      } else {
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        effectivePlan,
        isEmailVerified,
        loading,
        refresh,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        resendVerificationEmail,
        sendPasswordResetEmail,
        updatePassword,
        updateEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
