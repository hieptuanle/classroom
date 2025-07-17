import { Ionicons } from "@expo/vector-icons";
import { useAtom, useAtomValue } from "jotai";
import React, { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Post, PostFilter } from "@/types/post";

import { CreatePostModal } from "@/components/create-post-modal";
import { PostCard } from "@/components/post-card";
import { mockPostService } from "@/services/mock-post-service";
import { userRoleAtom } from "@/store/class-atoms";
import { createPostModalAtom, postFilterAtom } from "@/store/post-atoms";

const filterTabs: { key: PostFilter; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "list-outline" },
  { key: "assignments", label: "Assignments", icon: "document-text-outline" },
  { key: "announcements", label: "Announcements", icon: "megaphone-outline" },
  { key: "for-you", label: "For You", icon: "heart-outline" },
];

type StreamTabProps = {
  classId: string;
};

export function StreamTab({ classId }: StreamTabProps) {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const [filter, setFilter] = useAtom(postFilterAtom);
  const [createModalVisible, setCreateModalVisible] = useAtom(createPostModalAtom);
  const userRole = useAtomValue(userRoleAtom);

  const isTeacher = userRole === "teacher";

  const loadPosts = useCallback(async (refresh = false) => {
    if (!hasMore && !refresh)
      return;

    setIsLoading(!refresh);

    try {
      const currentPage = refresh ? 0 : page;
      const response = await mockPostService.getPosts(classId, {
        page: currentPage,
        filter,
        limit: 10,
      });

      setHasMore(response.hasMore);
      setPage(currentPage + 1);
    }
    catch (error) {
      console.error("Failed to load posts:", error);
    }
    finally {
      setIsLoading(false);
    }
  }, [filter, classId, hasMore, page]);

  // Load posts when filter changes
  React.useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    loadPosts(true);
  }, [filter, classId, loadPosts]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadPosts();
    }
  };

  const handlePostPress = (_post: Post) => {
    // Navigate to post detail
    // In a real implementation with Expo Router:
    // router.push(`/posts/${post.id}`);
  };

  const handleCommentPress = (_post: Post) => {
    // Navigate to post detail with comments focused
    // In a real implementation with Expo Router:
    // router.push(`/posts/${post.id}?showComments=true`);
  };

  const handleLikePress = async (post: Post) => {
    try {
      await mockPostService.likePost(post.id);
      // Update local state
      setPosts(prev =>
        prev.map(p =>
          p.id === post.id
            ? {
                ...p,
                isLiked: !p.isLiked,
                likesCount: p.likesCount + (p.isLiked ? -1 : 1),
              }
            : p,
        ),
      );
    }
    catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleSharePress = (_post: Post) => {
    // Handle sharing
  };

  const handleCreatePost = async (postData: any) => {
    setIsCreating(true);
    try {
      await mockPostService.createPost(postData);
      setCreateModalVisible(false);
      await loadPosts(true);
    }
    catch (error) {
      console.error("Failed to create post:", error);
    }
    finally {
      setIsCreating(false);
    }
  };

  const renderEmptyState = () => {
    const messages = {
      "all": {
        title: "No posts yet",
        subtitle: "Posts and announcements will appear here",
        icon: "newspaper-outline" as const,
      },
      "assignments": {
        title: "No assignments",
        subtitle: "Assignment posts will appear here",
        icon: "document-text-outline" as const,
      },
      "announcements": {
        title: "No announcements",
        subtitle: "Class announcements will appear here",
        icon: "megaphone-outline" as const,
      },
      "for-you": {
        title: "Nothing for you yet",
        subtitle: "Personalized content will appear here",
        icon: "heart-outline" as const,
      },
    };

    const message = messages[filter];

    return (
      <View className="flex-1 justify-center items-center px-8 py-16">
        <Ionicons name={message.icon} size={64} color="#9CA3AF" />
        <Text className="text-xl font-semibold text-gray-800 mt-4 text-center">
          {message.title}
        </Text>
        <Text className="text-sm text-gray-600 mt-2 text-center">
          {message.subtitle}
        </Text>

        {isTeacher && filter !== "for-you" && (
          <Pressable
            onPress={() => setCreateModalVisible(true)}
            className="bg-blue-500 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-semibold">Create Post</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderLoadingFooter = () => {
    if (!isLoading)
      return null;

    return (
      <View className="py-4 items-center">
        <Text className="text-gray-600">Loading more posts...</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Filter Tabs */}
      <View className="bg-white border-b border-gray-200">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterTabs}
          keyExtractor={(tab, index) => `${tab.key}-${index}`}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
          renderItem={({ item: tab }) => (
            <Pressable
              onPress={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-full mr-3 flex-row items-center ${
                filter === tab.key
                  ? "bg-blue-600"
                  : "bg-gray-100"
              }`}
            >
              <Ionicons
                name={tab.icon as any}
                size={16}
                color={filter === tab.key ? "white" : "#6B7280"}
              />
              <Text
                className={`ml-2 font-medium ${
                  filter === tab.key ? "text-white" : "text-gray-600"
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(post, index) => `${post.id}-${index}`}
        renderItem={({ item: post }) => (
          <View className="px-4">
            <PostCard
              post={post}
              onPress={() => handlePostPress(post)}
              onComment={() => handleCommentPress(post)}
              onLike={() => handleLikePress(post)}
              onShare={() => handleSharePress(post)}
              showMenu
              userRole={userRole}
            />
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={!isLoading ? renderEmptyState() : null}
        ListFooterComponent={renderLoadingFooter}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
        }}
        style={{ flex: 1 }}
      />

      {/* Floating Action Button */}
      {isTeacher && (
        <Pressable
          onPress={() => setCreateModalVisible(true)}
          className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
            marginBottom: insets.bottom,
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        visible={createModalVisible}
        classId={classId}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreatePost}
        isLoading={isCreating}
        userRole={userRole}
      />
    </View>
  );
}
