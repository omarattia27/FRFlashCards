import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { isSupabaseConfigured, supabase, supabaseConfigError } from "../lib/supabase";
import { useAuth } from "./auth-store";

export type WordPair = {
  id: string;
  english: string;
  french: string;
};

type WordStoreValue = {
  words: WordPair[];
  isWordsLoading: boolean;
  addWord: (english: string, french: string) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
};

const WordStoreContext = createContext<WordStoreValue | null>(null);

export function WordProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [words, setWords] = useState<WordPair[]>([]);
  const [isWordsLoading, setIsWordsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadWordsForUser() {
      if (!isSupabaseConfigured) {
        setWords([]);
        setIsWordsLoading(false);
        return;
      }

      if (!user) {
        setWords([]);
        setIsWordsLoading(false);
        return;
      }

      setIsWordsLoading(true);

      const { data, error } = await supabase
        .from("word_pairs")
        .select("id, english, french")
        .order("created_at", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (error) {
        setWords([]);
      } else {
        setWords(data ?? []);
      }

      setIsWordsLoading(false);
    }

    loadWordsForUser().catch(() => {
      if (isMounted) {
        setWords([]);
        setIsWordsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const value = useMemo<WordStoreValue>(
    () => ({
      words,
      isWordsLoading,
      addWord: async (english, french) => {
        if (!isSupabaseConfigured) {
          throw new Error(supabaseConfigError);
        }

        if (!user) {
          throw new Error("You must be signed in to add words.");
        }

        const { data, error } = await supabase
          .from("word_pairs")
          .insert({
            user_id: user.id,
            english,
            french,
          })
          .select("id, english, french")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          setWords((currentWords) => [data, ...currentWords]);
        }
      },
      deleteWord: async (id) => {
        if (!isSupabaseConfigured) {
          throw new Error(supabaseConfigError);
        }

        if (!user) {
          throw new Error("You must be signed in to delete words.");
        }

        const { error } = await supabase
          .from("word_pairs")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          throw new Error(error.message);
        }

        setWords((currentWords) => currentWords.filter((word) => word.id !== id));
      },
    }),
    [isWordsLoading, user, words],
  );

  return (
    <WordStoreContext.Provider value={value}>
      {children}
    </WordStoreContext.Provider>
  );
}

export function useWords() {
  const context = useContext(WordStoreContext);

  if (!context) {
    throw new Error("useWords must be used within a WordProvider");
  }

  return context;
}