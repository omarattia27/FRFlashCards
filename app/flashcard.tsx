import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import Navbar from "../components/navbar";
import { useAuth } from "../data/auth-store";
import { WordPair, useWords } from "../data/word-store";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function pickRandomWord(words: WordPair[]) {
  return words[Math.floor(Math.random() * words.length)];
}

export default function FlashcardScreen() {
  const { user, isAuthLoading } = useAuth();
  const { words } = useWords();
  const [currentWord, setCurrentWord] = useState<WordPair | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(pickRandomWord(words));
    }
  }, [words]);

  const canCheck = useMemo(
    () => answer.trim().length > 0 && currentWord !== null,
    [answer, currentWord],
  );

  const nextWord = () => {
    if (words.length === 0) {
      setCurrentWord(null);
      return;
    }

    setCurrentWord(pickRandomWord(words));
    setAnswer("");
    setFeedback("");
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (!currentWord) {
      Alert.alert("No words available", "Add a few words first.");
      return;
    }

    const correct = normalize(answer) === normalize(currentWord.french);

    setIsCorrect(correct);
    setFeedback(
      correct
        ? "Correct"
        : `Incorrect. The right answer is ${currentWord.french}.`,
    );
  };

  if (isAuthLoading) {
    return (
      <View style={styles.container}>
        <Navbar title="Flashcards" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Navbar title="Flashcards" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Sign in to practice your saved words.</Text>
          <Pressable onPress={() => router.push("/")} style={styles.backLink}>
            <Text style={styles.backLinkText}>Back to sign in</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar title="Flashcards" />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Translate this word to French</Text>
          <Text style={styles.question}>
            {currentWord ? currentWord.english : "No words yet"}
          </Text>
        </View>

        <TextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder="Type the French translation"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          editable={Boolean(currentWord)}
          onSubmitEditing={checkAnswer}
        />

        <View style={styles.actions}>
          <Pressable
            onPress={checkAnswer}
            disabled={!canCheck}
            style={({ pressed }) => [
              styles.primaryButton,
              !canCheck && styles.buttonDisabled,
              pressed && canCheck && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Check</Text>
          </Pressable>

          <Pressable
            onPress={nextWord}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Next word</Text>
          </Pressable>
        </View>

        {feedback ? (
          <View
            style={[
              styles.feedbackBox,
              isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
            ]}
          >
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        ) : null}

        <Pressable onPress={() => router.push("/")} style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to list</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7fb",
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#111827",
  },
  label: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 10,
  },
  question: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  secondaryButtonText: {
    color: "#111827",
    fontWeight: "700",
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  feedbackBox: {
    padding: 14,
    borderRadius: 12,
  },
  feedbackCorrect: {
    backgroundColor: "#dcfce7",
  },
  feedbackWrong: {
    backgroundColor: "#fee2e2",
  },
  feedbackText: {
    color: "#111827",
    fontWeight: "600",
  },
  backLink: {
    alignSelf: "center",
    paddingVertical: 8,
  },
  backLinkText: {
    color: "#2563eb",
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyStateText: {
    color: "#374151",
    fontSize: 16,
    textAlign: "center",
  },
});