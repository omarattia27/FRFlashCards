import { Stack } from "expo-router";

import { AuthProvider } from "../data/auth-store";
import { WordProvider } from "../data/word-store";

export default function RootLayout() {
  return (
    <AuthProvider>
      <WordProvider>
        <Stack />
      </WordProvider>
    </AuthProvider>
  );
}
