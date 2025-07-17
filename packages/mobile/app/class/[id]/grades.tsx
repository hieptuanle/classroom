import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function ClassGradesScreen() {
  return (
    <ScrollView className="flex-1 p-4">
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Điểm số của bạn</Text>
        <Text className="text-gray-600">Chưa có điểm nào</Text>
      </View>

      <View className="bg-white rounded-lg p-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Thống kê</Text>
        <Text className="text-gray-600">Chưa có dữ liệu</Text>
      </View>
    </ScrollView>
  );
}
