import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

import AuthForm from "../components/auth-form";

import Navbar from "../components/navbar";
import WordList from "../components/word-list";
import { useAuth } from "../data/auth-store";

export default function Index() {
  const { user, isAuthLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    const result = await signOut();

    if (result.error) {
      Alert.alert("Sign out failed", result.error);
    }
  };

  if (isAuthLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Navbar title="Sign In" />
        <AuthForm />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar title="Word List" actionLabel="Sign out" onActionPress={() => {
        void handleSignOut();
      }} />
      <WordList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7fb",
    paddingTop: 20,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7fb",
  },
});
