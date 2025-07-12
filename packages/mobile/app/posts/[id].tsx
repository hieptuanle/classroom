import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Post } from "@/types/post";

import { CommentSection } from "@/components/comment-section";
import { mockPostService } from "@/services/mock-post-service";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const loadPost = useCallback(async () => {
    if (!id)
      return;

    setIsLoading(true);
    try {
      const data = await mockPostService.getPost(id);
      setPost(data);
    }
    catch (error) {
      console.error("Failed to load post:", error);
    }
    finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleLike = async () => {
    if (!post)
      return;

    try {
      await mockPostService.likePost(post.id);
      setPost(prev => prev
        ? {
            ...prev,
            isLiked: !prev.isLiked,
            likesCount: prev.likesCount + (prev.isLiked ? -1 : 1),
          }
        : null);
    }
    catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!post)
      return;

    try {
      const newComment = await mockPostService.addComment(post.id, content);
      setPost(prev => prev
        ? {
            ...prev,
            comments: [...prev.comments, newComment],
          }
        : null);
    }
    catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!post)
      return;

    try {
      await mockPostService.likeComment(commentId);
      // Reload post to get updated comment likes
      await loadPost();
    }
    catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleShare = async () => {
    if (!post)
      return;

    try {
      await Share.share({
        message: `${post.title || post.content}\n\nShared from Classroom`,
        title: post.title || "Class Post",
      });
    }
    catch (error) {
      console.error("Failed to share post:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPostTypeColor = () => {
    if (!post)
      return "#6366F1";

    switch (post.type) {
      case "assignment":
        return "#10B981";
      case "material":
        return "#3B82F6";
      default:
        return "#6366F1";
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Loading post...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Ionicons name="document-outline" size={64} color="#9CA3AF" />
        <Text className="text-xl font-semibold text-gray-800 mt-4">
          Post not found
        </Text>
        <Text className="text-sm text-gray-600 mt-2">
          This post may have been deleted or moved
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="p-2 -ml-2 mr-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-900">
            {post.type === "assignment"
              ? "Assignment"
              : post.type === "material"
                ? "Material"
                : "Post"}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Pressable
            onPress={() => setShowComments(!showComments)}
            className="p-2 mr-1"
          >
            <Ionicons
              name={showComments ? "document-text" : "chatbubble-outline"}
              size={24}
              color="#6B7280"
            />
          </Pressable>
          <Pressable className="p-2">
            <Ionicons name="ellipsis-vertical" size={24} color="#6B7280" />
          </Pressable>
        </View>
      </View>

      {
        showComments
          ? (
              <CommentSection
                postId={post.id}
                comments={post.comments}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                canModerate={post.author.role === "teacher"}
              />
            )
          : (
              <ScrollView className="flex-1">
                {/* Post Header */}
                <View className="p-4 border-b border-gray-100">
                  <View className="flex-row items-center mb-3">
                    {/* Post type indicator */}
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${getPostTypeColor()}15` }}
                    >
                      <Ionicons
                        name={
                          post.type === "assignment"
                            ? "document-text-outline"
                            : post.type === "material"
                              ? "folder-outline"
                              : "megaphone-outline"
                        }
                        size={24}
                        color={getPostTypeColor()}
                      />
                    </View>

                    {/* Author info */}
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-lg font-semibold text-gray-900">
                          {post.author.firstName}
                          {" "}
                          {post.author.lastName}
                        </Text>
                        {post.author.role === "teacher" && (
                          <View className="ml-2 px-2 py-1 bg-blue-100 rounded">
                            <Text className="text-xs text-blue-700 font-medium">Teacher</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-sm text-gray-600 mt-1">
                        {formatDate(post.createdAt)}
                      </Text>
                    </View>

                    {post.isPinned && (
                      <Ionicons name="pin" size={20} color="#EF4444" />
                    )}
                  </View>

                  {/* Post title */}
                  {post.title && (
                    <Text className="text-2xl font-bold text-gray-900 mb-4">
                      {post.title}
                    </Text>
                  )}

                  {/* Assignment details */}
                  {post.type === "assignment" && (post.dueDate || post.points) && (
                    <View className="bg-red-50 rounded-lg p-4 mb-4 border border-red-100">
                      <View className="flex-row items-center justify-between">
                        {post.dueDate && (
                          <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={20} color="#DC2626" />
                            <Text className="text-red-700 ml-2 font-medium">
                              Due
                              {" "}
                              {formatDate(post.dueDate)}
                            </Text>
                          </View>
                        )}
                        {post.points && (
                          <View className="flex-row items-center">
                            <Ionicons name="star-outline" size={20} color="#DC2626" />
                            <Text className="text-red-700 ml-2 font-medium">
                              {post.points}
                              {" "}
                              points
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </View>

                {/* Post Content */}
                <View className="p-4">
                  <Text className="text-gray-800 text-base leading-6 mb-4">
                    {post.content}
                  </Text>

                  {/* Attachments */}
                  {post.attachments.length > 0 && (
                    <View className="mb-4">
                      <Text className="text-lg font-semibold text-gray-900 mb-3">
                        Attachments
                      </Text>
                      {post.attachments.map(attachment => (
                        <Pressable
                          key={attachment.id}
                          className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-2"
                        >
                          {attachment.type === "image" && attachment.thumbnail
                            ? (
                                <Image
                                  source={{ uri: attachment.thumbnail }}
                                  className="w-12 h-12 rounded mr-3"
                                  resizeMode="cover"
                                />
                              )
                            : (
                                <View className="w-12 h-12 bg-gray-200 rounded items-center justify-center mr-3">
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
                                </View>
                              )}
                          <View className="flex-1">
                            <Text className="font-medium text-gray-900">
                              {attachment.name}
                            </Text>
                            {attachment.size && (
                              <Text className="text-sm text-gray-600">
                                {(attachment.size / 1024 / 1024).toFixed(1)}
                                {" "}
                                MB
                              </Text>
                            )}
                          </View>
                          <Ionicons name="download-outline" size={20} color="#6B7280" />
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View className="flex-row items-center justify-between px-4 py-4 border-t border-gray-100">
                  <View className="flex-row items-center space-x-8">
                    <Pressable
                      onPress={handleLike}
                      className="flex-row items-center"
                    >
                      <Ionicons
                        name={post.isLiked ? "heart" : "heart-outline"}
                        size={24}
                        color={post.isLiked ? "#EF4444" : "#6B7280"}
                      />
                      {post.likesCount > 0 && (
                        <Text className="text-gray-600 ml-2">
                          {post.likesCount}
                        </Text>
                      )}
                    </Pressable>

                    <Pressable
                      onPress={() => setShowComments(true)}
                      className="flex-row items-center"
                    >
                      <Ionicons name="chatbubble-outline" size={24} color="#6B7280" />
                      {post.comments.length > 0 && (
                        <Text className="text-gray-600 ml-2">
                          {post.comments.length}
                        </Text>
                      )}
                    </Pressable>
                  </View>

                  <Pressable onPress={handleShare}>
                    <Ionicons name="share-outline" size={24} color="#6B7280" />
                  </Pressable>
                </View>
              </ScrollView>
            )
      }
    </View>
  );
}
