import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function ClassOverviewScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  return (
    <ScrollView className="flex-1 p-4">
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-2">Thông tin lớp học</Text>
        <Text className="text-gray-600">
          Mã lớp:
          {id}
        </Text>
        <Text className="text-gray-600">
          Tên lớp:
          {name}
        </Text>
      </View>

      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Hoạt động gần đây</Text>
        <Text className="text-gray-600">Chưa có hoạt động nào</Text>
      </View>

      <View className="bg-white rounded-lg p-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Thông báo</Text>
        <Text className="text-gray-600">Chưa có thông báo mới</Text>
      </View>
    </ScrollView>
  );
}
