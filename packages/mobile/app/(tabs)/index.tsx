import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push("/login" as any);
  };

  const handleRegisterPress = () => {
    router.push("/register" as any);
  };

  return (
    <View className="flex-1 items-center justify-center p-5 bg-gray-50">
      <View className="bg-white rounded-xl p-8 shadow-lg w-full max-w-sm">
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

      <View className="mt-8 flex-row gap-4">
        <View className="bg-emerald-500 px-4 py-2 rounded-full">
          <Text className="text-white font-medium">NativeWind</Text>
        </View>
        <View className="bg-purple-500 px-4 py-2 rounded-full">
          <Text className="text-white font-medium">Working!</Text>
        </View>
      </View>
    </View>
  );
}
