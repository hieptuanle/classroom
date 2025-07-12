import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import type { ClassCardProps } from "@/types/class";

export function ClassCard({
  class: classData,
  onPress,
  showRole: _showRole = false,
  showMenu = false,
  userRole: _userRole,
}: ClassCardProps) {
  const studentCount = classData.students.length;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100 active:bg-gray-50"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Header with title and menu */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-xl font-bold text-gray-900 mb-2" numberOfLines={2}>
            {classData.name}
          </Text>
          <Text className="text-base text-gray-600 font-medium">
            {classData.subject}
          </Text>
          <Text className="text-sm text-gray-500">
            {classData.section}
          </Text>
        </View>

        {showMenu && (
          <Pressable
            className="p-2 -m-2"
            onPress={(e) => {
              e.stopPropagation();
              // Handle menu press
            }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
          </Pressable>
        )}
      </View>

      {/* Teacher name */}
      <View className="mb-4">
        <Text className="text-sm text-gray-600">
          {classData.teachers[0]?.firstName}
          {" "}
          {classData.teachers[0]?.lastName}
        </Text>
      </View>

      {/* Bottom section with room and student count */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">{classData.room}</Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="people-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">
            {studentCount}
          </Text>
        </View>
      </View>

      {/* Archived indicator */}
      {classData.archived && (
        <View className="mt-3 pt-3 border-t border-gray-200">
          <View className="flex-row items-center">
            <Ionicons name="archive-outline" size={16} color="#EF4444" />
            <Text className="text-sm text-red-500 ml-1 font-medium">Archived</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
