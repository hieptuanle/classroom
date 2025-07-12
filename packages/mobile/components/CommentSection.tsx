import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import type { Comment, CommentSectionProps } from "@/types/post";

export function CommentSection({
  postId,
  comments,
  onAddComment,
  onLikeComment,
  canModerate,
  isLoading = false,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting)
      return;

    setSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment("");
      setReplyingTo(null);
    }
    catch (error) {
      console.error("Failed to add comment:", error);
    }
    finally {
      setSubmitting(false);
    }
  };

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

  const renderComment = (comment: Comment, isReply = false) => {
    return (
      <View
        key={comment.id}
        className={`${isReply ? "ml-12 mt-3" : "mb-4"}`}
      >
        <View className="flex-row">
          {/* Avatar */}
          <View className="mr-3">
            {comment.author.avatar
              ? (
                  <Image
                    source={{ uri: comment.author.avatar }}
                    className="w-8 h-8 rounded-full"
                  />
                )
              : (
                  <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
                    <Text className="text-gray-600 text-sm font-medium">
                      {comment.author.firstName[0]}
                      {comment.author.lastName[0]}
                    </Text>
                  </View>
                )}
          </View>

          {/* Comment Content */}
          <View className="flex-1">
            {/* Author and timestamp */}
            <View className="flex-row items-center mb-1">
              <Text className="text-sm font-medium text-gray-900">
                {comment.author.firstName}
                {" "}
                {comment.author.lastName}
              </Text>
              {comment.author.role === "teacher" && (
                <View className="ml-2 px-1.5 py-0.5 bg-blue-100 rounded">
                  <Text className="text-xs text-blue-700 font-medium">Teacher</Text>
                </View>
              )}
              <Text className="text-xs text-gray-500 ml-2">
                {formatDate(comment.createdAt)}
              </Text>
            </View>

            {/* Comment text */}
            <View className="bg-gray-100 rounded-2xl px-3 py-2 mb-2">
              <Text className="text-gray-800">{comment.content}</Text>
            </View>

            {/* Actions */}
            <View className="flex-row items-center">
              <Pressable
                onPress={() => onLikeComment(comment.id)}
                className="flex-row items-center mr-4"
              >
                <Ionicons
                  name={comment.isLiked ? "heart" : "heart-outline"}
                  size={16}
                  color={comment.isLiked ? "#EF4444" : "#6B7280"}
                />
                {comment.likesCount > 0 && (
                  <Text className="text-xs text-gray-600 ml-1">
                    {comment.likesCount}
                  </Text>
                )}
              </Pressable>

              {!isReply && (
                <Pressable
                  onPress={() => setReplyingTo(comment.id)}
                  className="mr-4"
                >
                  <Text className="text-xs text-gray-600 font-medium">Reply</Text>
                </Pressable>
              )}

              {canModerate && (
                <Pressable>
                  <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
                </Pressable>
              )}
            </View>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <View className="mt-3">
                {comment.replies.map(reply => renderComment(reply, true))}
              </View>
            )}

            {/* Reply input (if replying to this comment) */}
            {replyingTo === comment.id && (
              <View className="mt-3 ml-12">
                <View className="flex-row items-end bg-white rounded-2xl border border-gray-200 px-3 py-2">
                  <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder={`Reply to ${comment.author.firstName}...`}
                    multiline
                    maxLength={500}
                    className="flex-1 text-gray-800 max-h-20"
                    editable={!submitting}
                  />
                  <View className="flex-row ml-2">
                    <Pressable
                      onPress={() => {
                        setReplyingTo(null);
                        setNewComment("");
                      }}
                      className="p-1 mr-1"
                      disabled={submitting}
                    >
                      <Ionicons name="close" size={20} color="#6B7280" />
                    </Pressable>
                    <Pressable
                      onPress={handleSubmitComment}
                      disabled={!newComment.trim() || submitting}
                      className="p-1"
                    >
                      <Ionicons
                        name="send"
                        size={20}
                        color={newComment.trim() && !submitting ? "#3B82F6" : "#9CA3AF"}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1">
        {/* Comments List */}
        <ScrollView className="flex-1 px-4 py-4">
          {isLoading
            ? (
                <View className="items-center py-8">
                  <Text className="text-gray-600">Loading comments...</Text>
                </View>
              )
            : comments.length === 0
              ? (
                  <View className="items-center py-8">
                    <Ionicons name="chatbubble-outline" size={48} color="#9CA3AF" />
                    <Text className="text-lg font-medium text-gray-800 mt-2">
                      No comments yet
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1 text-center">
                      Be the first to leave a comment
                    </Text>
                  </View>
                )
              : (
                  comments.map(comment => renderComment(comment))
                )}
        </ScrollView>

        {/* Comment Input */}
        {!replyingTo && (
          <View className="border-t border-gray-200 px-4 py-3 bg-white">
            <View className="flex-row items-end bg-gray-50 rounded-2xl px-3 py-2">
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                multiline
                maxLength={500}
                className="flex-1 text-gray-800 max-h-20"
                editable={!submitting}
              />
              <Pressable
                onPress={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                className="p-1 ml-2"
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={newComment.trim() && !submitting ? "#3B82F6" : "#9CA3AF"}
                />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
