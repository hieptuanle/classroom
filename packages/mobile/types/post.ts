export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: "teacher" | "student";
};

export type Attachment = {
  id: string;
  type: "image" | "document" | "video" | "link";
  name: string;
  url: string;
  size?: number;
  thumbnail?: string;
};

export type Comment = {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  likesCount: number;
  isLiked: boolean;
};

export type Post = {
  id: string;
  classId: string;
  type: "announcement" | "assignment" | "material";
  title?: string;
  content: string;
  author: User;
  attachments: Attachment[];
  comments: Comment[];
  likesCount: number;
  isLiked: boolean;
  isPinned: boolean;
  isDraft: boolean;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  points?: number;
};

export type PostFilter = "all" | "assignments" | "announcements" | "for-you";

export type CreatePostData = {
  classId: string;
  type: Post["type"];
  title?: string;
  content: string;
  attachments?: Omit<Attachment, "id">[];
  recipients?: string[];
  scheduledAt?: string;
  dueDate?: string;
  points?: number;
};

export type PostCardProps = {
  post: Post;
  onPress: () => void;
  onComment: () => void;
  onLike: () => void;
  onShare?: () => void;
  showMenu?: boolean;
  userRole?: "teacher" | "student";
};

export type RichTextEditorProps = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  toolbar?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
};

export type AttachmentPickerProps = {
  onAttachments: (files: Attachment[]) => void;
  maxFiles?: number;
  allowedTypes: ("image" | "document" | "video")[];
  visible: boolean;
  onClose: () => void;
};

export type CommentSectionProps = {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string) => void;
  canModerate: boolean;
  isLoading?: boolean;
};

export type CreatePostModalProps = {
  visible: boolean;
  classId: string;
  onClose: () => void;
  onSubmit: (data: CreatePostData) => void;
  isLoading: boolean;
  userRole: "teacher" | "student";
};

export type PostDetailProps = {
  postId: string;
  classId: string;
};

export type PostsResponse = {
  posts: Post[];
  nextPage?: number;
  hasMore: boolean;
  total: number;
};

export type GetPostsOptions = {
  page?: number;
  limit?: number;
  filter?: PostFilter;
  search?: string;
};
