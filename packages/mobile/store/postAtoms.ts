import { atom } from "jotai";

import type { Attachment, CreatePostData, Post, PostFilter } from "@/types/post";

// Selected post for navigation
export const selectedPostAtom = atom<Post | null>(null);

// Post filter state for feed
export const postFilterAtom = atom<PostFilter>("all");

// Create post modal state
export const createPostModalAtom = atom(false);

// Post creation form data
export const postDraftAtom = atom<Partial<CreatePostData>>({
  type: "announcement",
  content: "",
  title: "",
  attachments: [],
});

// Rich text content
export const postContentAtom = atom("");

// Post title (for assignments)
export const postTitleAtom = atom("");

// Attachments for post creation
export const postAttachmentsAtom = atom<Attachment[]>([]);

// Recipients selection (empty means all students)
export const postRecipientsAtom = atom<string[]>([]);

// Schedule settings
export const postScheduleAtom = atom<{
  isDraft: boolean;
  scheduledAt?: Date;
}>({ isDraft: false });

// Assignment specific settings
export const assignmentSettingsAtom = atom<{
  dueDate?: Date;
  points?: number;
}>({});

// Reset post form
export const resetPostFormAtom = atom(null, (_, set) => {
  set(postDraftAtom, {
    type: "announcement",
    content: "",
    title: "",
    attachments: [],
  });
  set(postContentAtom, "");
  set(postTitleAtom, "");
  set(postAttachmentsAtom, []);
  set(postRecipientsAtom, []);
  set(postScheduleAtom, { isDraft: false });
  set(assignmentSettingsAtom, {});
});

// Post type selection
export const postTypeAtom = atom<"announcement" | "assignment" | "material">("announcement");

// Comment being composed
export const commentContentAtom = atom("");

// Reply to comment state
export const replyToCommentAtom = atom<string | null>(null);
