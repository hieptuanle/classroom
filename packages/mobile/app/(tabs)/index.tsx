import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/themed";
import { useColorScheme } from "@/components/use-color-scheme";
import Colors from "@/constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.7,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "white",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
});

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const handleLoginPress = () => {
    router.push("/login" as any);
  };

  const handleRegisterPress = () => {
    router.push("/register" as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Classroom</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Your digital classroom management system
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.primaryButton]}
          onPress={handleLoginPress}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            Sign In
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={handleRegisterPress}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Create Account
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
