import { Pressable, StyleSheet, Text, View } from "react-native";

type NavbarProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function Navbar({ title, actionLabel, onActionPress }: NavbarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#374151",
  },
  actionText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.85,
  },
});