import { Text, View } from "react-native";

import EditScreenInfo from "@/components/edit-screen-info";

export default function NoRouteScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Text className="text-xl font-bold text-gray-900 dark:text-white">
        Tab Two
      </Text>
      <View className="my-8 h-px w-4/5 bg-gray-300 dark:bg-gray-600" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}
