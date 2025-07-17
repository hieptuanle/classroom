import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function ClassPeopleScreen() {
  return (
    <ScrollView className="flex-1 p-4">
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Giáo viên</Text>
        <Text className="text-gray-600">Đang tải...</Text>
      </View>

      <View className="bg-white rounded-lg p-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Học sinh</Text>
        <Text className="text-gray-600">Đang tải...</Text>
      </View>
    </ScrollView>
  );
}
