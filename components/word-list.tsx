import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useWords } from "../data/word-store";

export default function WordList() {
  const { words, isWordsLoading, addWord, deleteWord } = useWords();
  const [english, setEnglish] = useState("");
  const [french, setFrench] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const canAdd = useMemo(
    () => english.trim().length > 0 && french.trim().length > 0,
    [english, french],
  );

  const saveWord = async () => {
    const nextEnglish = english.trim();
    const nextFrench = french.trim();

    if (!nextEnglish || !nextFrench) {
      Alert.alert(
        "Enter both words",
        "Add the English and French version before saving.",
      );
      return;
    }

    setIsSaving(true);

    try {
      await addWord(nextEnglish, nextFrench);
      setEnglish("");
      setFrench("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not save word.";
      Alert.alert("Save failed", message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.quizButtonRow}>
        <Pressable
          onPress={() => router.push("/flashcard")}
          style={({ pressed }) => [
            styles.quizButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Practice flashcards</Text>
        </Pressable>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          value={english}
          onChangeText={setEnglish}
          placeholder="English"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={saveWord}
        />
        <TextInput
          value={french}
          onChangeText={setFrench}
          placeholder="French"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={saveWord}
        />
        <Pressable
          onPress={() => {
            void saveWord();
          }}
          style={({ pressed }) => [
            styles.addButton,
            (!canAdd || isSaving) && styles.addButtonDisabled,
            pressed && canAdd && !isSaving && styles.buttonPressed,
          ]}
          disabled={!canAdd || isSaving}
        >
          <Text style={styles.buttonText}>{isSaving ? "Saving..." : "Add"}</Text>
        </Pressable>
      </View>

      {isWordsLoading ? <ActivityIndicator color="#2563eb" size="small" style={styles.loader} /> : null}

      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.wordColumn}>
              <Text style={styles.englishText}>{item.english}</Text>
              <Text style={styles.frenchText}>{item.french}</Text>
            </View>
            <Pressable
              onPress={() => {
                void deleteWord(item.id).catch((error: unknown) => {
                  const message = error instanceof Error ? error.message : "Could not delete word.";
                  Alert.alert("Delete failed", message);
                });
              }}
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No words yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  quizButtonRow: {
    marginBottom: 16,
  },
  quizButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  input: {
    flexBasis: "46%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
  },
  addButton: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#93c5fd",
  },
  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fee2e2",
  },
  deleteButtonText: {
    color: "#b91c1c",
    fontWeight: "600",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },
  loader: {
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  wordColumn: {
    flex: 1,
    paddingRight: 12,
  },
  englishText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "700",
  },
  frenchText: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 24,
  },
});