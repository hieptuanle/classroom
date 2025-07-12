import { Ionicons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { CreatePostData, CreatePostModalProps } from "@/types/post";

import {
  assignmentSettingsAtom,
  postContentAtom,
  postTitleAtom,
  postTypeAtom,
  resetPostFormAtom,
} from "@/store/postAtoms";

export function CreatePostModal({
  visible,
  classId,
  onClose,
  onSubmit,
  isLoading,
  userRole,
}: CreatePostModalProps) {
  const insets = useSafeAreaInsets();
  const [content, setContent] = useAtom(postContentAtom);
  const [title, setTitle] = useAtom(postTitleAtom);
  const [postType, setPostType] = useAtom(postTypeAtom);
  const [assignmentSettings, setAssignmentSettings] = useAtom(assignmentSettingsAtom);
  const [, resetForm] = useAtom(resetPostFormAtom);

  const [showAssignmentOptions, setShowAssignmentOptions] = useState(false);

  const isTeacher = userRole === "teacher";

  const postTypes = [
    {
      key: "announcement" as const,
      label: "Announcement",
      icon: "megaphone-outline",
      color: "#6366F1",
      description: "Share news and updates",
    },
    {
      key: "assignment" as const,
      label: "Assignment",
      icon: "document-text-outline",
      color: "#10B981",
      description: "Create an assignment with due date",
      teacherOnly: true,
    },
    {
      key: "material" as const,
      label: "Material",
      icon: "folder-outline",
      color: "#3B82F6",
      description: "Share resources and materials",
      teacherOnly: true,
    },
  ].filter(type => !type.teacherOnly || isTeacher);

  const handleClose = () => {
    resetForm();
    setShowAssignmentOptions(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter some content for your post");
      return;
    }

    if (postType === "assignment" && !title.trim()) {
      Alert.alert("Error", "Please enter a title for your assignment");
      return;
    }

    const postData: CreatePostData = {
      classId,
      type: postType,
      content: content.trim(),
      title: postType === "assignment" ? title.trim() : undefined,
      dueDate: assignmentSettings.dueDate?.toISOString(),
      points: assignmentSettings.points,
    };

    onSubmit(postData);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDatePress = () => {
    // In a real app, this would open a date picker
    Alert.alert("Date Picker", "Date picker would open here");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
        style={{ paddingTop: insets.top }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <Pressable onPress={handleClose} disabled={isLoading}>
            <Text className="text-blue-600 text-lg">Cancel</Text>
          </Pressable>

          <Text className="text-lg font-semibold text-gray-900">Create Post</Text>

          <Pressable
            onPress={handleSubmit}
            disabled={isLoading || !content.trim()}
            className={`px-4 py-2 rounded-lg ${
              isLoading || !content.trim()
                ? "bg-gray-300"
                : "bg-blue-600"
            }`}
          >
            <Text
              className={`font-semibold ${
                isLoading || !content.trim() ? "text-gray-500" : "text-white"
              }`}
            >
              {isLoading ? "Posting..." : "Post"}
            </Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1">
          {/* Post Type Selection */}
          <View className="p-4 border-b border-gray-100">
            <Text className="text-sm font-medium text-gray-700 mb-3">Post Type</Text>
            <View className="flex-row flex-wrap">
              {postTypes.map(type => (
                <Pressable
                  key={type.key}
                  onPress={() => {
                    setPostType(type.key);
                    if (type.key === "assignment") {
                      setShowAssignmentOptions(true);
                    }
                    else {
                      setShowAssignmentOptions(false);
                      setTitle("");
                      setAssignmentSettings({});
                    }
                  }}
                  className={`flex-row items-center p-3 rounded-lg mr-3 mb-3 border ${
                    postType === type.key
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${type.color}15` }}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={16}
                      color={type.color}
                    />
                  </View>
                  <View>
                    <Text
                      className={`font-medium ${
                        postType === type.key ? "text-blue-700" : "text-gray-800"
                      }`}
                    >
                      {type.label}
                    </Text>
                    <Text className="text-xs text-gray-600">{type.description}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Assignment Title (if assignment) */}
          {postType === "assignment" && (
            <View className="p-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Assignment Title *
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter assignment title..."
                className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800 text-lg"
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
          )}

          {/* Content */}
          <View className="p-4 border-b border-gray-100">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {postType === "assignment" ? "Instructions" : "Content"}
              {" "}
              *
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder={
                postType === "assignment"
                  ? "Enter assignment instructions..."
                  : postType === "material"
                    ? "Describe the material..."
                    : "What would you like to announce?"
              }
              multiline
              numberOfLines={6}
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800 min-h-32"
              textAlignVertical="top"
              autoCapitalize="sentences"
              editable={!isLoading}
            />
          </View>

          {/* Assignment Options */}
          {showAssignmentOptions && (
            <View className="p-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Assignment Options
              </Text>

              {/* Due Date */}
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Due Date</Text>
                <Pressable
                  onPress={handleDatePress}
                  className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg"
                >
                  <Text className="text-gray-800">
                    {assignmentSettings.dueDate
                      ? formatDate(assignmentSettings.dueDate)
                      : "Select due date"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                </Pressable>
              </View>

              {/* Points */}
              <View>
                <Text className="text-sm text-gray-600 mb-2">Points</Text>
                <TextInput
                  value={assignmentSettings.points?.toString() || ""}
                  onChangeText={(text) => {
                    const points = Number.parseInt(text) || undefined;
                    setAssignmentSettings(prev => ({ ...prev, points }));
                  }}
                  placeholder="Enter points (optional)"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
                  editable={!isLoading}
                />
              </View>
            </View>
          )}

          {/* Attachments Section */}
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-medium text-gray-700">Attachments</Text>
              <Pressable className="flex-row items-center">
                <Ionicons name="add" size={20} color="#3B82F6" />
                <Text className="text-blue-600 ml-1 font-medium">Add</Text>
              </Pressable>
            </View>

            <View className="flex-row flex-wrap">
              <Pressable className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center mr-3 mb-3">
                <Ionicons name="camera-outline" size={24} color="#6B7280" />
                <Text className="text-xs text-gray-600 mt-1">Photo</Text>
              </Pressable>

              <Pressable className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center mr-3 mb-3">
                <Ionicons name="document-outline" size={24} color="#6B7280" />
                <Text className="text-xs text-gray-600 mt-1">File</Text>
              </Pressable>

              <Pressable className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center mr-3 mb-3">
                <Ionicons name="link-outline" size={24} color="#6B7280" />
                <Text className="text-xs text-gray-600 mt-1">Link</Text>
              </Pressable>
            </View>
          </View>

          {/* Recipients Section (for teachers) */}
          {isTeacher && (
            <View className="p-4">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Post to
              </Text>
              <Pressable className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg">
                <View className="flex-row items-center">
                  <Ionicons name="people-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-800 ml-2">All students</Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
