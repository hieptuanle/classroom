import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { JotaiDemo } from "@/components/jotai-demo";
import { userApi } from "@/services/api-service";
import { showWelcomeAtom, useAtomValue } from "@/store";

type User = {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
};

const fetchUsers = async (): Promise<User[]> => {
  return userApi.getUsers();
};

export default function HomeScreen() {
  const router = useRouter();
  const showWelcome = useAtomValue(showWelcomeAtom);
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Animation values
  const opacity = useSharedValue(showWelcome ? 1 : 0);
  const height = useSharedValue(showWelcome ? 1 : 0);

  // Update animations when showWelcome changes
  React.useEffect(() => {
    const config = {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };

    opacity.value = withTiming(showWelcome ? 1 : 0, config);
    height.value = withTiming(showWelcome ? 1 : 0, config);
  }, [showWelcome, opacity, height]);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scaleY: height.value }],
      overflow: "hidden" as const,
    };
  });

  const handleLoginPress = () => {
    router.push("/login" as any);
  };

  const handleRegisterPress = () => {
    router.push("/register" as any);
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[animatedStyle, { marginBottom: 24 }]}>
        <View className="bg-white rounded-xl p-8 shadow-lg w-full">
          <Text className="text-3xl font-bold text-center mb-5 text-gray-800">
            Welcome to Classroom
          </Text>
          <Text className="text-base text-center mb-10 text-gray-600">
            Your digital classroom management system
          </Text>

          <View className="w-full gap-4">
            <Pressable
              className="bg-blue-500 rounded-lg py-4 items-center active:bg-blue-600"
              onPress={handleLoginPress}
            >
              <Text className="text-white text-base font-semibold">
                Sign In
              </Text>
            </Pressable>

            <Pressable
              className="border border-blue-500 rounded-lg py-4 items-center active:bg-blue-50"
              onPress={handleRegisterPress}
            >
              <Text className="text-blue-500 text-base font-semibold">
                Create Account
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {/* Jotai Demo Section */}
      <JotaiDemo />

      <Text className="text-xl font-bold mb-4 text-gray-800">
        TanStack Query Demo - Backend Users
      </Text>

      {isLoading && (
        <View className="py-10 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-2 text-gray-600">Loading users...</Text>
        </View>
      )}

      {error && (
        <View className="py-10 justify-center items-center">
          <Text className="text-red-500 text-center">
            Error loading users:
            {" "}
            {error.message}
          </Text>
        </View>
      )}

      {users && users.map(item => (
        <View
          key={item.id}
          className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200"
        >
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            {item.fullName || item.username}
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            @
            {item.username}
            {" "}
            •
            {" "}
            {item.email}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className={`px-2 py-1 rounded-full ${item.role === "admin" ? "bg-red-100" : item.role === "teacher" ? "bg-blue-100" : "bg-green-100"}`}>
              <Text className={`text-xs font-medium ${item.role === "admin" ? "text-red-700" : item.role === "teacher" ? "text-blue-700" : "text-green-700"}`}>
                {item.role}
              </Text>
            </View>
            <View className={`px-2 py-1 rounded-full ${item.isActive ? "bg-green-100" : "bg-gray-100"}`}>
              <Text className={`text-xs font-medium ${item.isActive ? "text-green-700" : "text-gray-700"}`}>
                {item.isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
        </View>
      ))}

      <View className="mt-4 flex-row gap-2 justify-center flex-wrap">
        <View className="bg-emerald-500 px-3 py-2 rounded-full">
          <Text className="text-white font-medium text-sm">TanStack Query</Text>
        </View>
        <View className="bg-purple-500 px-3 py-2 rounded-full">
          <Text className="text-white font-medium text-sm">Jotai</Text>
        </View>
        <View className="bg-blue-500 px-3 py-2 rounded-full">
          <Text className="text-white font-medium text-sm">Backend API</Text>
        </View>
      </View>
    </ScrollView>
  );
}
