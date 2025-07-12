# Issue #9: Implement Mobile Announcements and Posts

## Description

Implement mobile announcement and post management functionality including viewing announcements, creating posts, commenting, and rich content support.

## Requirements

- Announcement feed with filtering
- Create announcement form (teachers)
- Rich text editor support
- File attachment handling
- Comment system
- Draft and scheduled posts
- Post editing and deletion
- Real-time updates

## Acceptance Criteria

- [ ] Announcement feed screen with infinite scroll
- [ ] Create announcement form with rich editor
- [ ] File attachment picker (images, documents, links)
- [ ] Comment system with threading
- [ ] Post detail view with full content
- [ ] Draft posts management
- [ ] Edit/delete posts (teachers)
- [ ] Real-time updates for new posts
- [ ] Filter posts by type and assignment status
- [ ] Loading states and error handling
- [ ] Offline support with caching

## Implementation Plan

1. **Announcement Feed**: Scrollable list with posts
2. **Rich Text Editor**: Implement formatting tools
3. **File Attachments**: Media picker and upload
4. **Comment System**: Threaded comments with reactions
5. **Post Creation**: Full-featured post composer
6. **Draft Management**: Save and manage drafts
7. **Real-time Updates**: WebSocket integration
8. **Offline Support**: Cached content and sync
9. **State Management**: Posts data with TanStack Query
10. **Testing**: Component and integration tests

## Screen Specifications

### Announcement Feed (`/classes/[id]/stream`)

- Infinite scroll post list
- Filter tabs: "All", "Assignments", "For You"
- Post cards with author, date, content preview
- Interaction buttons (like, comment, share)
- FAB for creating posts (teachers)
- Pull-to-refresh functionality

### Create Post Screen (`/classes/[id]/posts/create`)

- Rich text editor with formatting toolbar
- Attachment picker (images, files, links)
- Recipient selection (all students or specific)
- Post type selection (announcement, assignment)
- Schedule/draft options
- Preview functionality

### Post Detail Screen (`/classes/[id]/posts/[postId]`)

- Full post content with formatting
- Attachment gallery/viewer
- Author information and timestamp
- Comment section with replies
- Edit/delete options (for authors)
- Share functionality

## Component Structure

### PostCard Component

```typescript
type PostCardProps = {
  post: Post;
  onPress: () => void;
  onComment: () => void;
  onLike: () => void;
  showMenu?: boolean;
};
```

### RichTextEditor Component

```typescript
type RichTextEditorProps = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  toolbar?: boolean;
  maxLength?: number;
};
```

### AttachmentPicker Component

```typescript
type AttachmentPickerProps = {
  onAttachments: (files: Attachment[]) => void;
  maxFiles?: number;
  allowedTypes: ("image" | "document" | "video")[];
};
```

### CommentSection Component

```typescript
type CommentSectionProps = {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  canModerate: boolean;
};
```

## State Management

### Post Queries (TanStack Query)

```typescript
// Get posts for a class
function usePosts(classId: string, filter?: string) {
  return useInfiniteQuery({
    queryKey: ["posts", classId, filter],
    queryFn: ({ pageParam = 0 }) =>
      postService.getPosts(classId, { page: pageParam, filter }),
    getNextPageParam: lastPage => lastPage.nextPage
  });
}

// Get post details
function usePost(postId: string) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => postService.getPost(postId)
  });
}

// Create post mutation
function useCreatePost() {
  return useMutation({
    mutationFn: postService.createPost,
    onSuccess: (newPost) => {
      queryClient.invalidateQueries(["posts", newPost.classId]);
    }
  });
}

// Update post mutation
function useUpdatePost() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Post> }) =>
      postService.updatePost(id, data),
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries(["post", updatedPost.id]);
      queryClient.invalidateQueries(["posts", updatedPost.classId]);
    }
  });
}
```

### Post Creation State (Jotai)

```typescript
// Post draft state
export const postDraftAtom = atom<Partial<Post>>({});

// Rich text content
export const postContentAtom = atom("");

// Attachments
export const postAttachmentsAtom = atom<Attachment[]>([]);

// Recipients
export const postRecipientsAtom = atom<string[]>([]);

// Schedule settings
export const postScheduleAtom = atom<{
  isDraft: boolean;
  scheduledAt?: Date;
}>({ isDraft: false });
```

## Rich Text Features

### Supported Formatting

- Bold, italic, underline
- Bullet and numbered lists
- Links
- Text alignment
- Font size options
- Color highlighting

### Content Types

- Plain text with formatting
- Embedded images
- File attachments
- YouTube/video links
- Web links with previews

## File Handling

### Attachment Types

```typescript
type Attachment = {
  id: string;
  type: "image" | "document" | "video" | "link";
  name: string;
  url: string;
  size?: number;
  thumbnail?: string;
};
```

### Upload Process

1. File selection from device
2. Compression for images
3. Upload to backend with progress
4. Thumbnail generation
5. Integration with post content

## Real-time Features

### WebSocket Events

```typescript
type PostEvents = {
  "post:created": (post: Post) => void;
  "post:updated": (post: Post) => void;
  "post:deleted": (postId: string) => void;
  "comment:added": (comment: Comment) => void;
};
```

## API Integration

### Post Service

```typescript
class PostService {
  async getPosts(classId: string, options?: GetPostsOptions): Promise<PostsResponse>;
  async getPost(id: string): Promise<Post>;
  async createPost(data: CreatePostData): Promise<Post>;
  async updatePost(id: string, data: Partial<Post>): Promise<Post>;
  async deletePost(id: string): Promise<void>;
  async addComment(postId: string, content: string): Promise<Comment>;
  async getComments(postId: string): Promise<Comment[]>;
}
```

## Dependencies

- Issue #8: Mobile Class Management
- Backend Issue #4: Post Management System
- Backend Issue #6: File Upload System

## Priority

High

## Estimated Time

6-7 days

## Labels

- mobile
- announcements
- rich-content
- high-priority
