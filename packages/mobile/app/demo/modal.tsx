import { StatusBar } from "expo-status-bar";
import { Platform, Text, View } from "react-native";

import EditScreenInfo from "@/components/edit-screen-info";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Text className="text-xl font-bold text-gray-900 dark:text-white">
        Modal
      </Text>
      <View className="my-8 h-px w-4/5 bg-gray-300 dark:bg-gray-600" />
      <EditScreenInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
