import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useAuth } from "../data/auth-store";

type AuthMode = "sign-in" | "sign-up";

export default function AuthForm() {
  const { signIn, signUp, isSupabaseConfigured, configError } = useAuth();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length >= 6,
    [email, password],
  );

  const submit = async () => {
    const nextEmail = email.trim();
    const nextPassword = password.trim();

    if (!nextEmail || nextPassword.length < 6) {
      Alert.alert("Invalid credentials", "Use a valid email and at least 6 characters for password.");
      return;
    }

    setIsSubmitting(true);

    const result = mode === "sign-in"
      ? await signIn(nextEmail, nextPassword)
      : await signUp(nextEmail, nextPassword);

    setIsSubmitting(false);

    if (result.error) {
      Alert.alert("Authentication error", result.error);
      return;
    }

    if (mode === "sign-up") {
      Alert.alert("Account created", "Sign-up succeeded. If email confirmation is enabled, confirm your email before signing in.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{mode === "sign-in" ? "Welcome back" : "Create your account"}</Text>
      <Text style={styles.subtitle}>Sign in to sync your words securely with Supabase.</Text>

      {!isSupabaseConfigured && configError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{configError}</Text>
        </View>
      ) : null}

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password (min 6 chars)"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        onSubmitEditing={submit}
      />

      <Pressable
        onPress={submit}
        disabled={!canSubmit || isSubmitting}
        style={({ pressed }) => [
          styles.submitButton,
          (!canSubmit || isSubmitting) && styles.submitButtonDisabled,
          pressed && canSubmit && !isSubmitting && styles.buttonPressed,
        ]}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Sign up"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"))}
        style={({ pressed }) => [styles.switchButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.switchButtonText}>
          {mode === "sign-in"
            ? "No account? Create one"
            : "Already have an account? Sign in"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
    gap: 12,
  },
  heading: {
    fontSize: 24,
    color: "#111827",
    fontWeight: "800",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  errorBox: {
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 10,
  },
  errorText: {
    color: "#991b1b",
    fontSize: 13,
    fontWeight: "500",
  },
  submitButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#93c5fd",
  },
  submitButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  switchButton: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  switchButtonText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.85,
  },
});