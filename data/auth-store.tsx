import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { Session, User } from "@supabase/supabase-js";

import { isSupabaseConfigured, supabase, supabaseConfigError } from "../lib/supabase";

type AuthResult = {
  error: string | null;
};

type AuthStoreValue = {
  session: Session | null;
  user: User | null;
  isAuthLoading: boolean;
  isSupabaseConfigured: boolean;
  configError: string | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthStoreContext = createContext<AuthStoreValue | null>(null);

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) {
          return;
        }

        if (!error) {
          setSession(data.session);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthStoreValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthLoading,
      isSupabaseConfigured,
      configError: isSupabaseConfigured ? null : supabaseConfigError,
      signIn: async (email, password) => {
        if (!isSupabaseConfigured) {
          return { error: supabaseConfigError };
        }

        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          return { error: error?.message ?? null };
        } catch (error: unknown) {
          return { error: getErrorMessage(error) };
        }
      },
      signUp: async (email, password) => {
        if (!isSupabaseConfigured) {
          return { error: supabaseConfigError };
        }

        try {
          const { error } = await supabase.auth.signUp({ email, password });
          return { error: error?.message ?? null };
        } catch (error: unknown) {
          return { error: getErrorMessage(error) };
        }
      },
      signOut: async () => {
        if (!isSupabaseConfigured) {
          return { error: supabaseConfigError };
        }

        try {
          const { error } = await supabase.auth.signOut();
          return { error: error?.message ?? null };
        } catch (error: unknown) {
          return { error: getErrorMessage(error) };
        }
      },
    }),
    [isAuthLoading, session],
  );

  return (
    <AuthStoreContext.Provider value={value}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthStoreContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}