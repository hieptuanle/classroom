import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import React, { useCallback, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

import type { Class, ClassFilter } from "@/types/class";

import { mockClassService } from "@/services/mock-class-service";
import {
  classFilterAtom,
  createClassModalAtom,
  joinClassModalAtom,
  userRoleAtom,
} from "@/store/class-atoms";

import { ClassCard } from "./-components/class-card";
import { ClassCreateModal } from "./-components/class-create-modal";
import { JoinClassModal } from "./-components/join-class-modal";

const filterTabs: { key: ClassFilter; label: string }[] = [
  { key: "teaching", label: "Teaching" },
  { key: "enrolled", label: "Enrolled" },
  { key: "archived", label: "Archived" },
];

export default function ClassesScreen() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const [filter, setFilter] = useAtom(classFilterAtom);
  const [createModalVisible, setCreateModalVisible] = useAtom(createClassModalAtom);
  const [joinModalVisible, setJoinModalVisible] = useAtom(joinClassModalAtom);
  const userRole = useAtomValue(userRoleAtom);

  const isTeacher = userRole === "teacher";

  const loadClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await mockClassService.getClasses(filter);
      setClasses(data);
    }
    catch (error) {
      console.error("Failed to load classes:", error);
    }
    finally {
      setIsLoading(false);
    }
  }, [filter]);

  // Load classes when filter changes
  React.useEffect(() => {
    // Clear existing classes and show loading when filter changes
    setClasses([]);
    loadClasses();
  }, [filter, loadClasses]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadClasses();
    setIsRefreshing(false);
  };

  const handleClassPress = (classData: Class) => {
    router.push(`/demo/classes/${classData.id}`);
  };

  const handleCreateClass = async (formData: any) => {
    setIsCreating(true);
    try {
      await mockClassService.createClass(formData);
      setCreateModalVisible(false);
      await loadClasses();
    }
    catch (error) {
      console.error("Failed to create class:", error);
    }
    finally {
      setIsCreating(false);
    }
  };

  const handleJoinClass = async (code: string) => {
    setIsJoining(true);
    try {
      await mockClassService.joinClass(code);
      setJoinModalVisible(false);
      await loadClasses();
    }
    catch (error) {
      console.error("Failed to join class:", error);
    }
    finally {
      setIsJoining(false);
    }
  };

  const renderEmptyState = () => {
    const messages = {
      teaching: {
        title: "No classes yet",
        subtitle: "Create your first class to get started",
        icon: "school-outline" as const,
      },
      enrolled: {
        title: "Not enrolled in any classes",
        subtitle: "Join a class using an invite code",
        icon: "people-outline" as const,
      },
      archived: {
        title: "No archived classes",
        subtitle: "Archived classes will appear here",
        icon: "archive-outline" as const,
      },
    };

    const message = messages[filter];

    return (
      <View className="flex-1 justify-center items-center px-8">
        <Ionicons name={message.icon} size={64} color="#9CA3AF" />
        <Text className="text-xl font-semibold text-gray-800 mt-4 text-center">
          {message.title}
        </Text>
        <Text className="text-sm text-gray-600 mt-2 text-center">
          {message.subtitle}
        </Text>

        {filter === "teaching" && isTeacher && (
          <Pressable
            onPress={() => setCreateModalVisible(true)}
            className="bg-blue-500 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-semibold">Create Class</Text>
          </Pressable>
        )}

        {filter === "enrolled" && (
          <Pressable
            onPress={() => setJoinModalVisible(true)}
            className="bg-green-500 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-semibold">Join Class</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-3xl font-bold text-gray-900">Classes</Text>

          <View className="flex-row">
            {/* Join Class Button */}
            <Pressable
              onPress={() => setJoinModalVisible(true)}
              className="bg-white border border-gray-300 px-4 py-2 rounded-full flex-row items-center mr-3"
            >
              <Ionicons name="add" size={18} color="#374151" />
              <Text className="text-gray-700 font-medium ml-1">Join</Text>
            </Pressable>

            {/* Create Class Button (Teachers only) */}
            {isTeacher && (
              <Pressable
                onPress={() => setCreateModalVisible(true)}
                className="bg-blue-600 px-4 py-2 rounded-full flex-row items-center"
              >
                <Ionicons name="add" size={18} color="white" />
                <Text className="text-white font-medium ml-1">Create</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white border-b border-gray-200">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6"
          contentContainerStyle={{ paddingVertical: 16 }}
        >
          {filterTabs.map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              className={`px-6 py-3 rounded-full mr-3 ${
                filter === tab.key
                  ? "bg-blue-600"
                  : "bg-gray-100"
              }`}
            >
              <Text
                className={`font-semibold ${
                  filter === tab.key ? "text-white" : "text-gray-600"
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Classes List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading && classes.length === 0
          ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600">Loading classes...</Text>
              </View>
            )
          : classes.length === 0
            ? (
                renderEmptyState()
              )
            : (
                classes.map(classData => (
                  <ClassCard
                    key={classData.id}
                    class={classData}
                    onPress={() => handleClassPress(classData)}
                    showRole
                    showMenu
                    userRole={userRole}
                  />
                ))
              )}
      </ScrollView>

      {/* Modals */}
      <ClassCreateModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateClass}
        isLoading={isCreating}
      />

      <JoinClassModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
        onJoin={handleJoinClass}
        isLoading={isJoining}
      />
    </View>
  );
}
