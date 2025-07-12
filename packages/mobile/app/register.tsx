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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !username || !fullName || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("http://localhost:3232/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          full_name: fullName,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!");
        // TODO: Store token and navigate to main app
        router.push("/(tabs)");
      }
      else {
        Alert.alert("Error", data.message || "Registration failed");
      }
    }
    catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Registration error:", error);
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
            Create Account
          </Text>
          <Text className="text-base text-center mb-8 opacity-70 text-gray-900 dark:text-white">
            Sign up to get started
          </Text>

          <View className="w-full">
            <View className="mb-4">
              <Text className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                Full Name
              </Text>
              <TextInput
                className="border border-blue-500 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
                autoComplete="name"
              />
            </View>

            <View className="mb-4">
              <Text className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                Username
              </Text>
              <TextInput
                className="border border-blue-500 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Choose a username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
              />
            </View>

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
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            <View className="mb-4">
              <Text className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                Confirm Password
              </Text>
              <TextInput
                className="border border-blue-500 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            <Pressable
              className={`bg-blue-500 rounded-lg py-4 items-center mt-2 ${isLoading ? "opacity-70" : ""}`}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text className="text-base font-semibold text-white">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </Pressable>

            <View className="flex-row justify-center mt-6">
              <Text className="text-sm text-gray-900 dark:text-white">
                Already have an account?
                {" "}
              </Text>
              <Pressable onPress={() => router.push("/login" as any)}>
                <Text className="text-sm font-semibold text-blue-500">
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
