import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import type { ClassCreateFormProps, ClassForm } from "@/types/class";

type ClassCreateModalProps = {
  visible: boolean;
  onClose: () => void;
} & Omit<ClassCreateFormProps, "onCancel">;

export function ClassCreateModal({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}: ClassCreateModalProps) {
  const [formData, setFormData] = useState<ClassForm>({
    name: "",
    subject: "",
    section: "",
    room: "",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<ClassForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ClassForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Class name is required";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.section.trim()) {
      newErrors.section = "Section is required";
    }
    if (!formData.room.trim()) {
      newErrors.room = "Room is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        name: "",
        subject: "",
        section: "",
        room: "",
        description: "",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      subject: "",
      section: "",
      room: "",
      description: "",
    });
    setErrors({});
    onClose();
  };

  const updateField = (field: keyof ClassForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="bg-white border-b border-gray-200 px-4 py-3">
            <View className="flex-row justify-between items-center">
              <Pressable onPress={handleClose} className="p-2 -ml-2">
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>

              <Text className="text-lg font-semibold text-gray-800">
                Create Class
              </Text>

              <Pressable
                onPress={handleSubmit}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg ${
                  isLoading ? "bg-gray-300" : "bg-blue-500"
                }`}
              >
                <Text className={`font-medium ${
                  isLoading ? "text-gray-500" : "text-white"
                }`}
                >
                  {isLoading ? "Creating..." : "Create"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Form */}
          <ScrollView className="flex-1 p-4">
            <View className="space-y-4">
              {/* Class Name */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Class Name *
                </Text>
                <TextInput
                  value={formData.name}
                  onChangeText={value => updateField("name", value)}
                  placeholder="e.g., Advanced React Native"
                  className={`bg-white border rounded-lg px-3 py-3 text-gray-800 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholderTextColor="#9CA3AF"
                />
                {errors.name && (
                  <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
                )}
              </View>

              {/* Subject */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </Text>
                <TextInput
                  value={formData.subject}
                  onChangeText={value => updateField("subject", value)}
                  placeholder="e.g., Computer Science"
                  className={`bg-white border rounded-lg px-3 py-3 text-gray-800 ${
                    errors.subject ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholderTextColor="#9CA3AF"
                />
                {errors.subject && (
                  <Text className="text-red-500 text-sm mt-1">{errors.subject}</Text>
                )}
              </View>

              {/* Section */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Section *
                </Text>
                <TextInput
                  value={formData.section}
                  onChangeText={value => updateField("section", value)}
                  placeholder="e.g., CS-401"
                  className={`bg-white border rounded-lg px-3 py-3 text-gray-800 ${
                    errors.section ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholderTextColor="#9CA3AF"
                />
                {errors.section && (
                  <Text className="text-red-500 text-sm mt-1">{errors.section}</Text>
                )}
              </View>

              {/* Room */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Room *
                </Text>
                <TextInput
                  value={formData.room}
                  onChangeText={value => updateField("room", value)}
                  placeholder="e.g., Room 101"
                  className={`bg-white border rounded-lg px-3 py-3 text-gray-800 ${
                    errors.room ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholderTextColor="#9CA3AF"
                />
                {errors.room && (
                  <Text className="text-red-500 text-sm mt-1">{errors.room}</Text>
                )}
              </View>

              {/* Description */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </Text>
                <TextInput
                  value={formData.description}
                  onChangeText={value => updateField("description", value)}
                  placeholder="Brief description of the class..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-gray-800"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Info note */}
              <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <View className="flex-row items-start">
                  <Ionicons name="information-circle" size={20} color="#3B82F6" />
                  <View className="flex-1 ml-3">
                    <Text className="text-blue-800 font-medium text-sm mb-1">
                      Class Invitation
                    </Text>
                    <Text className="text-blue-700 text-sm">
                      After creating the class, you'll receive an invitation code that students can use to join.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
