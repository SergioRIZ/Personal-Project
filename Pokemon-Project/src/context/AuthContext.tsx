import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // Only update state if the session actually changed (user id or access token).
      // Supabase fires this callback on every visibility-change even when nothing changed,
      // which would otherwise cause a full re-render cascade and re-fetch all data.
      setSession(prev => {
        const prevId = prev?.user?.id;
        const nextId = newSession?.user?.id;
        const prevToken = prev?.access_token;
        const nextToken = newSession?.access_token;
        if (prevId === nextId && prevToken === nextToken) return prev;
        return newSession;
      });
      // Clean up the hash fragment left by OAuth redirects
      if (_event === 'SIGNED_IN' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    loading,
  }), [session, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
