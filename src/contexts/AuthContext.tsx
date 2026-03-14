import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import {
  normalizeAccountStatus,
  persistAuthNotice,
  type AccountStatus,
  isSuperuserEmail,
} from '@/lib/authz';

export type AppPlan = 'free' | 'starter' | 'pro';

export interface UserProfile {
  plan: AppPlan;
  account_status: AccountStatus;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  effectivePlan: AppPlan;
  accountStatus: AccountStatus;
  isSuperuser: boolean;
  isEmailVerified: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildSignupRedirectUrl() {
  const url = new URL('/auth/callback', window.location.origin);
  url.searchParams.set('flow', 'signup');
  return url.toString();
}

function getEffectivePlan(profileRow: UserProfile | null, currentUser: User | null): AppPlan {
  if (isSuperuserEmail(currentUser?.email)) return 'pro';
  if (!profileRow) return 'free';
  return profileRow.plan;
}

function getAccountStatus(profileRow: UserProfile | null, currentUser: User | null): AccountStatus {
  if (isSuperuserEmail(currentUser?.email)) return 'active';
  return normalizeAccountStatus(profileRow?.account_status);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const effectivePlan = useMemo(() => getEffectivePlan(profile, user), [profile, user]);
  const accountStatus = useMemo(() => getAccountStatus(profile, user), [profile, user]);
  const isSuperuser = useMemo(() => isSuperuserEmail(user?.email), [user]);
  const isEmailVerified = Boolean(user?.email_confirmed_at);

  async function fetchProfile(currentUser: User | null): Promise<UserProfile | null> {
    if (!currentUser) return null;

    const { data } = await supabase
      .from('profiles')
      .select('plan, account_status')
      .eq('id', currentUser.id)
      .maybeSingle();

    return (data as UserProfile) || null;
  }

  async function syncSession(currentUser: User | null) {
    if (!currentUser) {
      setUser(null);
      setProfile(null);
      return;
    }

    const profileData = await fetchProfile(currentUser);
    const nextStatus = getAccountStatus(profileData, currentUser);
    if (nextStatus !== 'active') {
      persistAuthNotice(nextStatus);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      return;
    }

    setUser(currentUser);
    setProfile(profileData);
  }

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await syncSession(user);
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user || null;
        void syncSession(currentUser);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    const currentUser = data.user;
    const profileData = await fetchProfile(currentUser);
    const nextStatus = getAccountStatus(profileData, currentUser);
    if (nextStatus !== 'active') {
      persistAuthNotice(nextStatus);
      await supabase.auth.signOut();
      throw new Error(nextStatus === 'disabled' ? 'ACCOUNT_DISABLED' : 'ACCOUNT_PENDING');
    }
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: buildSignupRedirectUrl(),
      },
    });
    if (error) throw error;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: buildSignupRedirectUrl(),
      },
    });
    if (error) throw error;
  }

  async function refresh() {
    setLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      await syncSession(currentUser);
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
        accountStatus,
        isSuperuser,
        isEmailVerified,
        loading,
        refresh,
        signIn,
        signUp,
        signOut,
        resendVerificationEmail,
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
