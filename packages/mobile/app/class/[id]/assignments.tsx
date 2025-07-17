import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function ClassAssignmentsScreen() {
  return (
    <ScrollView className="flex-1 p-4">
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Bài tập sắp tới</Text>
        <Text className="text-gray-600">Chưa có bài tập nào</Text>
      </View>

      <View className="bg-white rounded-lg p-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Bài tập đã hoàn thành</Text>
        <Text className="text-gray-600">Chưa có bài tập nào</Text>
      </View>
    </ScrollView>
  );
}
