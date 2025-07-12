import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("http://localhost:3232/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Login successful!");
        // TODO: Store token and navigate to main app
        router.push("/(tabs)");
      }
      else {
        Alert.alert("Error", data.message || "Login failed");
      }
    }
    catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Login error:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 dark:bg-gray-900"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Welcome Back
          </Text>
          <Text className="text-base text-center mb-8 opacity-70 text-gray-900 dark:text-white">
            Sign in to your account
          </Text>

          <View className="w-full">
            <View className="mb-4">
              <Text className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                Email
              </Text>
              <TextInput
                className="border border-blue-500 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View className="mb-4">
              <Text className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                Password
              </Text>
              <TextInput
                className="border border-blue-500 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <Pressable
              className={`bg-blue-500 rounded-lg py-4 items-center mt-2 ${isLoading ? "opacity-70" : ""}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-base font-semibold text-white">
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </Pressable>

            <View className="flex-row justify-center mt-6">
              <Text className="text-sm text-gray-900 dark:text-white">
                Don't have an account?
                {" "}
              </Text>
              <Pressable onPress={() => router.push("/register" as any)}>
                <Text className="text-sm font-semibold text-blue-500">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
