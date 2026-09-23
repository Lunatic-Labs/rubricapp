import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import { clearSession, getSession, saveSession, type Session } from '@/api/auth';

interface SessionContextValue {
  session: Session | null;
  isLoading: boolean;
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const value = use(SessionContext);
  if (!value) {
    throw new Error('useSession must be used within a <SessionProvider />');
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then(setSession)
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = async (newSession: Session) => {
    await saveSession(newSession);
    setSession(newSession);
  };

  const signOut = async () => {
    await clearSession();
    setSession(null);
  };

  return (
    <SessionContext value={{ session, isLoading, signIn, signOut }}>{children}</SessionContext>
  );
}
