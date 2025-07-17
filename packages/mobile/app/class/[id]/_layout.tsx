import { Tabs } from "expo-router";

import { View } from "@/components/themed";

export default function ClassTabLayout() {
  return (
    <View className="flex-1 bg-white">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1976d2",
          tabBarInactiveTintColor: "#666",
          headerShown: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Tổng quan",
            tabBarLabel: "Tổng quan",
          }}
        />
        <Tabs.Screen
          name="assignments"
          options={{
            title: "Bài tập",
            tabBarLabel: "Bài tập",
          }}
        />
        <Tabs.Screen
          name="people"
          options={{
            title: "Thành viên",
            tabBarLabel: "Thành viên",
          }}
        />
        <Tabs.Screen
          name="grades"
          options={{
            title: "Điểm số",
            tabBarLabel: "Điểm số",
          }}
        />
      </Tabs>
    </View>

  );
}
