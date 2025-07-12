import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import type { PostCardProps } from "@/types/post";

export function PostCard({
  post,
  onPress,
  onComment,
  onLike,
  onShare,
  showMenu = true,
  userRole,
}: PostCardProps) {
  const isTeacher = userRole === "teacher";
  const canEdit = isTeacher && post.author.role === "teacher";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    }
    else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    }
    else if (diffInHours < 48) {
      return "Yesterday";
    }
    else {
      return date.toLocaleDateString();
    }
  };

  const getPostTypeIcon = () => {
    switch (post.type) {
      case "assignment":
        return "document-text-outline";
      case "material":
        return "folder-outline";
      default:
        return "megaphone-outline";
    }
  };

  const getPostTypeColor = () => {
    switch (post.type) {
      case "assignment":
        return "#10B981"; // Green
      case "material":
        return "#3B82F6"; // Blue
      default:
        return "#6366F1"; // Indigo
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-lg mb-4 border border-gray-200 active:bg-gray-50"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 pb-3">
        <View className="flex-row items-center flex-1">
          {/* Post type indicator */}
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${getPostTypeColor()}15` }}
          >
            <Ionicons
              name={getPostTypeIcon() as any}
              size={20}
              color={getPostTypeColor()}
            />
          </View>

          {/* Author info */}
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-sm font-medium text-gray-900">
                {post.author.firstName}
                {" "}
                {post.author.lastName}
              </Text>
              {post.author.role === "teacher" && (
                <View className="ml-2 px-2 py-0.5 bg-blue-100 rounded">
                  <Text className="text-xs text-blue-700 font-medium">Teacher</Text>
                </View>
              )}
            </View>
            <Text className="text-xs text-gray-500 mt-0.5">
              {formatDate(post.createdAt)}
              {post.isDraft && " • Draft"}
              {post.scheduledAt && " • Scheduled"}
            </Text>
          </View>
        </View>

        {/* Menu and pin indicator */}
        <View className="flex-row items-center">
          {post.isPinned && (
            <Ionicons name="pin" size={16} color="#EF4444" className="mr-2" />
          )}
          {showMenu && canEdit && (
            <Pressable
              className="p-2 -m-2"
              onPress={(e) => {
                e.stopPropagation();
                // Handle menu press
              }}
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      <View className="px-4 pb-3">
        {/* Title for assignments */}
        {post.title && (
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            {post.title}
          </Text>
        )}

        {/* Post content */}
        <Text
          className="text-gray-800 leading-5"
          numberOfLines={post.content.length > 200 ? 3 : undefined}
        >
          {post.content}
        </Text>

        {/* Assignment details */}
        {post.type === "assignment" && (post.dueDate || post.points) && (
          <View className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <View className="flex-row items-center justify-between">
              {post.dueDate && (
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={16} color="#DC2626" />
                  <Text className="text-sm text-red-700 ml-1 font-medium">
                    Due
                    {" "}
                    {formatDate(post.dueDate)}
                  </Text>
                </View>
              )}
              {post.points && (
                <View className="flex-row items-center">
                  <Ionicons name="star-outline" size={16} color="#DC2626" />
                  <Text className="text-sm text-red-700 ml-1 font-medium">
                    {post.points}
                    {" "}
                    points
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Attachments preview */}
        {post.attachments.length > 0 && (
          <View className="mt-3">
            <View className="flex-row flex-wrap">
              {post.attachments.slice(0, 3).map(attachment => (
                <View
                  key={attachment.id}
                  className="mr-2 mb-2 bg-gray-100 rounded-lg overflow-hidden"
                  style={{ width: 80, height: 60 }}
                >
                  {attachment.type === "image" && attachment.thumbnail
                    ? (
                        <Image
                          source={{ uri: attachment.thumbnail }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      )
                    : (
                        <View className="w-full h-full items-center justify-center">
                          <Ionicons
                            name={
                              attachment.type === "document"
                                ? "document-outline"
                                : attachment.type === "video"
                                  ? "play-circle-outline"
                                  : "link-outline"
                            }
                            size={24}
                            color="#6B7280"
                          />
                          <Text className="text-xs text-gray-600 mt-1 text-center px-1">
                            {attachment.name.length > 8
                              ? `${attachment.name.substring(0, 8)}...`
                              : attachment.name}
                          </Text>
                        </View>
                      )}
                </View>
              ))}
              {post.attachments.length > 3 && (
                <View className="w-20 h-15 items-center justify-center bg-gray-100 rounded-lg">
                  <Text className="text-sm text-gray-600 font-medium">
                    +
                    {post.attachments.length - 3}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-100">
        <View className="flex-row items-center space-x-6">
          {/* Like button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="flex-row items-center"
          >
            <Ionicons
              name={post.isLiked ? "heart" : "heart-outline"}
              size={20}
              color={post.isLiked ? "#EF4444" : "#6B7280"}
            />
            {post.likesCount > 0 && (
              <Text className="text-sm text-gray-600 ml-1">
                {post.likesCount}
              </Text>
            )}
          </Pressable>

          {/* Comment button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onComment();
            }}
            className="flex-row items-center"
          >
            <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
            {post.comments.length > 0 && (
              <Text className="text-sm text-gray-600 ml-1">
                {post.comments.length}
              </Text>
            )}
          </Pressable>
        </View>

        {/* Share button */}
        {onShare && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onShare();
            }}
          >
            <Ionicons name="share-outline" size={20} color="#6B7280" />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
