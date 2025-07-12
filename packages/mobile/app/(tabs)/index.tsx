import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { JotaiDemo } from "@/components/jotai-demo";
import { showWelcomeAtom, useAtomValue } from "@/store";

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function HomeScreen() {
  const router = useRouter();
  const showWelcome = useAtomValue(showWelcomeAtom);
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
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
      {showWelcome && (
        <View className="bg-white rounded-xl p-8 shadow-lg w-full mb-6">
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
      )}

      {/* Jotai Demo Section */}
      <JotaiDemo />

      <Text className="text-xl font-bold mb-4 text-gray-800">
        TanStack Query Demo - Latest Posts
      </Text>

      {isLoading && (
        <View className="py-10 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-2 text-gray-600">Loading posts...</Text>
        </View>
      )}

      {error && (
        <View className="py-10 justify-center items-center">
          <Text className="text-red-500 text-center">
            Error loading posts:
            {" "}
            {error.message}
          </Text>
        </View>
      )}

      {posts && posts.map(item => (
        <View
          key={item.id}
          className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200"
        >
          <Text className="text-lg font-semibold text-gray-800 mb-2" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-gray-600 text-sm" numberOfLines={3}>
            {item.body}
          </Text>
          <Text className="text-xs text-gray-400 mt-2">
            Post #
            {item.id}
          </Text>
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
          <Text className="text-white font-medium text-sm">Working!</Text>
        </View>
      </View>
    </ScrollView>
  );
}
