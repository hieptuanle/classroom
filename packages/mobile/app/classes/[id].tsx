import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Mock class data - this would come from TanStack Query in real implementation
  const classData = {
    id,
    name: "Advanced React Native",
    subject: "Computer Science",
    section: "CS-401",
    room: "Room 101",
    description: "Learn advanced React Native concepts and patterns",
    inviteCode: "ABC123",
    teacherName: "John Doe",
    studentCount: 25,
  };

  const tabs = [
    { key: "stream", label: "Stream", icon: "newspaper-outline" },
    { key: "assignments", label: "Assignments", icon: "document-text-outline" },
    { key: "members", label: "Members", icon: "people-outline" },
    { key: "about", label: "About", icon: "information-circle-outline" },
  ];

  const [activeTab, setActiveTab] = React.useState("stream");

  const renderTabContent = () => {
    switch (activeTab) {
      case "stream":
        return (
          <View className="p-4">
            <Text className="text-gray-600 text-center mt-8">
              No announcements yet
            </Text>
          </View>
        );
      case "assignments":
        return (
          <View className="p-4">
            <Text className="text-gray-600 text-center mt-8">
              No assignments yet
            </Text>
          </View>
        );
      case "members":
        return (
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Class Members
            </Text>
            <Text className="text-gray-600">
              {classData.studentCount}
              {" "}
              students enrolled
            </Text>
          </View>
        );
      case "about":
        return (
          <View className="p-4">
            <View className="bg-white rounded-lg p-4 mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Class Information
              </Text>
              <View className="space-y-3">
                <View className="flex-row">
                  <Text className="text-gray-600 w-20">Subject:</Text>
                  <Text className="text-gray-800 flex-1">{classData.subject}</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-gray-600 w-20">Section:</Text>
                  <Text className="text-gray-800 flex-1">{classData.section}</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-gray-600 w-20">Room:</Text>
                  <Text className="text-gray-800 flex-1">{classData.room}</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-gray-600 w-20">Teacher:</Text>
                  <Text className="text-gray-800 flex-1">{classData.teacherName}</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-gray-600 w-20">Code:</Text>
                  <Text className="text-gray-800 flex-1 font-mono">{classData.inviteCode}</Text>
                </View>
              </View>
            </View>

            {classData.description && (
              <View className="bg-white rounded-lg p-4">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </Text>
                <Text className="text-gray-600">{classData.description}</Text>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="p-2 -ml-2 mr-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>

          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800" numberOfLines={1}>
              {classData.name}
            </Text>
            <Text className="text-sm text-gray-600">
              {classData.section}
              {" "}
              •
              {classData.room}
            </Text>
          </View>

          <Pressable className="p-2 -mr-2">
            <Ionicons name="ellipsis-vertical" size={24} color="#6B7280" />
          </Pressable>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-t border-gray-200"
        >
          {tabs.map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`px-4 py-3 border-b-2 ${
                activeTab === tab.key
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={activeTab === tab.key ? "#3B82F6" : "#6B7280"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    activeTab === tab.key ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView className="flex-1">
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}
