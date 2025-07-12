import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import type { JoinClassModalProps } from "@/types/class";

export function JoinClassModal({
  visible,
  onClose,
  onJoin,
  isLoading = false,
}: JoinClassModalProps) {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!classCode.trim()) {
      setError("Please enter a class code");
      return;
    }

    try {
      await onJoin(classCode.trim().toUpperCase());
      setClassCode("");
      setError("");
    }
    catch (err) {
      setError(err instanceof Error ? err.message : "Invalid class code");
    }
  };

  const handleClose = () => {
    setClassCode("");
    setError("");
    onClose();
  };

  const handleCodeChange = (value: string) => {
    // Format as uppercase and limit to 6 characters
    const formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    setClassCode(formattedValue);

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="bg-white border-b border-gray-200 px-4 py-3">
            <View className="flex-row justify-between items-center">
              <Pressable onPress={handleClose} className="p-2 -ml-2">
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>

              <Text className="text-lg font-semibold text-gray-800">
                Join Class
              </Text>

              <View style={{ width: 24 }} />
            </View>
          </View>

          {/* Content */}
          <View className="flex-1 p-6">
            {/* Icon and title */}
            <View className="items-center mb-8">
              <View className="bg-green-100 rounded-full p-4 mb-4">
                <Ionicons name="people" size={32} color="#059669" />
              </View>
              <Text className="text-xl font-semibold text-gray-800 mb-2">
                Join a Class
              </Text>
              <Text className="text-gray-600 text-center">
                Enter the class code provided by your teacher
              </Text>
            </View>

            {/* Class Code Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Class Code
              </Text>
              <TextInput
                value={classCode}
                onChangeText={handleCodeChange}
                placeholder="ABC123"
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={6}
                className={`bg-white border rounded-lg px-4 py-4 text-center text-lg font-mono tracking-wider ${
                  error ? "border-red-300" : "border-gray-300"
                }`}
                placeholderTextColor="#9CA3AF"
                style={{ letterSpacing: 4 }}
              />
              {error && (
                <Text className="text-red-500 text-sm mt-2 text-center">{error}</Text>
              )}
            </View>

            {/* Join Button */}
            <Pressable
              onPress={handleJoin}
              disabled={isLoading || !classCode.trim()}
              className={`rounded-lg py-4 ${
                isLoading || !classCode.trim()
                  ? "bg-gray-300"
                  : "bg-green-500"
              }`}
            >
              <Text
                className={`text-center font-semibold text-lg ${
                  isLoading || !classCode.trim()
                    ? "text-gray-500"
                    : "text-white"
                }`}
              >
                {isLoading ? "Joining..." : "Join Class"}
              </Text>
            </Pressable>

            {/* Help text */}
            <View className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <View className="flex-row items-start">
                <Ionicons name="help-circle" size={20} color="#3B82F6" />
                <View className="flex-1 ml-3">
                  <Text className="text-blue-800 font-medium text-sm mb-1">
                    Where to find the class code?
                  </Text>
                  <Text className="text-blue-700 text-sm">
                    Your teacher will share a 6-character code (like ABC123) via email, message, or in person.
                  </Text>
                </View>
              </View>
            </View>

            {/* Future feature hint */}
            <View className="mt-4 p-4 bg-gray-100 rounded-lg">
              <View className="flex-row items-center justify-center">
                <Ionicons name="qr-code-outline" size={20} color="#6B7280" />
                <Text className="text-gray-600 text-sm ml-2">
                  QR Code scanning coming soon
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
