import type {
  Comment,
  CreatePostData,
  GetPostsOptions,
  Post,
  PostsResponse,
} from "@/types/post";

// Mock data for development
const mockPosts: Post[] = [
  {
    id: "1",
    classId: "1",
    type: "announcement",
    content: "Welcome to Advanced React Native! In this class, we'll explore advanced patterns, performance optimization, and native module integration. Please make sure you have the latest version of React Native CLI installed.",
    author: {
      id: "teacher1",
      username: "john.doe",
      firstName: "John",
      lastName: "Doe",
      role: "teacher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    attachments: [
      {
        id: "att1",
        type: "document",
        name: "Course Syllabus.pdf",
        url: "https://example.com/syllabus.pdf",
        size: 2048000,
      },
      {
        id: "att2",
        type: "link",
        name: "React Native Documentation",
        url: "https://reactnative.dev/docs/getting-started",
      },
    ],
    comments: [
      {
        id: "c1",
        content: "Thank you for the syllabus! Looking forward to the class.",
        author: {
          id: "student1",
          username: "jane.smith",
          firstName: "Jane",
          lastName: "Smith",
          role: "student",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        },
        createdAt: "2024-01-16T10:30:00Z",
        updatedAt: "2024-01-16T10:30:00Z",
        likesCount: 2,
        isLiked: false,
      },
    ],
    likesCount: 5,
    isLiked: false,
    isPinned: true,
    isDraft: false,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "2",
    classId: "1",
    type: "assignment",
    title: "Build a React Native Todo App",
    content: "Create a fully functional todo application using React Native. The app should include:\n\n• Add, edit, and delete todos\n• Mark todos as complete\n• Filter todos by status\n• Persist data using AsyncStorage\n• Clean, intuitive UI design\n\nPlease submit your code via GitHub and include a README with setup instructions.",
    author: {
      id: "teacher1",
      username: "john.doe",
      firstName: "John",
      lastName: "Doe",
      role: "teacher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    attachments: [
      {
        id: "att3",
        type: "document",
        name: "Assignment Requirements.pdf",
        url: "https://example.com/assignment.pdf",
        size: 1024000,
      },
    ],
    comments: [
      {
        id: "c2",
        content: "Can we use Expo for this project?",
        author: {
          id: "student2",
          username: "bob.wilson",
          firstName: "Bob",
          lastName: "Wilson",
          role: "student",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        },
        createdAt: "2024-01-17T14:20:00Z",
        updatedAt: "2024-01-17T14:20:00Z",
        likesCount: 1,
        isLiked: false,
        replies: [
          {
            id: "c2r1",
            content: "Yes, Expo is perfectly fine for this assignment!",
            author: {
              id: "teacher1",
              username: "john.doe",
              firstName: "John",
              lastName: "Doe",
              role: "teacher",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
            },
            createdAt: "2024-01-17T15:00:00Z",
            updatedAt: "2024-01-17T15:00:00Z",
            likesCount: 3,
            isLiked: true,
          },
        ],
      },
    ],
    likesCount: 8,
    isLiked: true,
    isPinned: false,
    isDraft: false,
    dueDate: "2024-02-01T23:59:00Z",
    points: 100,
    createdAt: "2024-01-17T08:00:00Z",
    updatedAt: "2024-01-17T08:00:00Z",
  },
  {
    id: "3",
    classId: "1",
    type: "material",
    title: "Week 2 Slides: Navigation Patterns",
    content: "Here are the slides from today's lecture on navigation patterns in React Native. We covered React Navigation v6, stack navigation, tab navigation, and drawer navigation.",
    author: {
      id: "teacher1",
      username: "john.doe",
      firstName: "John",
      lastName: "Doe",
      role: "teacher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    attachments: [
      {
        id: "att4",
        type: "document",
        name: "Navigation Patterns.pptx",
        url: "https://example.com/slides.pptx",
        size: 5120000,
      },
      {
        id: "att5",
        type: "image",
        name: "Navigation Diagram.png",
        url: "https://picsum.photos/400/300?random=1",
        thumbnail: "https://picsum.photos/200/150?random=1",
        size: 256000,
      },
    ],
    comments: [],
    likesCount: 3,
    isLiked: false,
    isPinned: false,
    isDraft: false,
    createdAt: "2024-01-18T16:30:00Z",
    updatedAt: "2024-01-18T16:30:00Z",
  },
  {
    id: "4",
    classId: "1",
    type: "announcement",
    content: "Reminder: Office hours are every Tuesday and Thursday from 2-4 PM in Room 205. Feel free to drop by if you have any questions about the course material or assignments!",
    author: {
      id: "teacher1",
      username: "john.doe",
      firstName: "John",
      lastName: "Doe",
      role: "teacher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    attachments: [],
    comments: [
      {
        id: "c3",
        content: "Great! I'll come by this Thursday.",
        author: {
          id: "student1",
          username: "jane.smith",
          firstName: "Jane",
          lastName: "Smith",
          role: "student",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        },
        createdAt: "2024-01-19T09:15:00Z",
        updatedAt: "2024-01-19T09:15:00Z",
        likesCount: 0,
        isLiked: false,
      },
    ],
    likesCount: 2,
    isLiked: false,
    isPinned: false,
    isDraft: false,
    createdAt: "2024-01-19T08:45:00Z",
    updatedAt: "2024-01-19T08:45:00Z",
  },
];

class MockPostService {
  async getPosts(
    classId: string,
    options: GetPostsOptions = {},
  ): Promise<PostsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const { page = 0, limit = 10, filter = "all" } = options;

    // Filter posts by class
    let filteredPosts = mockPosts.filter(post => post.classId === classId);

    // Apply filter
    switch (filter) {
      case "assignments":
        filteredPosts = filteredPosts.filter(post => post.type === "assignment");
        break;
      case "announcements":
        filteredPosts = filteredPosts.filter(post => post.type === "announcement");
        break;
      case "for-you":
        // For you could include pinned posts, recent comments, etc.
        filteredPosts = filteredPosts.filter(post => post.isPinned || post.isLiked);
        break;
      // "all" shows everything
    }

    // Sort by pinned first, then by creation date
    filteredPosts.sort((a, b) => {
      if (a.isPinned && !b.isPinned)
        return -1;
      if (!a.isPinned && b.isPinned)
        return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      nextPage: endIndex < filteredPosts.length ? page + 1 : undefined,
      hasMore: endIndex < filteredPosts.length,
      total: filteredPosts.length,
    };
  }

  async getPost(id: string): Promise<Post | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPosts.find(post => post.id === id) || null;
  }

  async createPost(data: CreatePostData): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPost: Post = {
      id: Date.now().toString(),
      ...data,
      author: {
        id: "teacher1",
        username: "john.doe",
        firstName: "John",
        lastName: "Doe",
        role: "teacher",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
      attachments: data.attachments?.map((att, index) => ({
        ...att,
        id: `att_${Date.now()}_${index}`,
      })) || [],
      comments: [],
      likesCount: 0,
      isLiked: false,
      isPinned: false,
      isDraft: !!data.scheduledAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockPosts.unshift(newPost);
    return newPost;
  }

  async updatePost(id: string, data: Partial<Post>): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const postIndex = mockPosts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    mockPosts[postIndex] = {
      ...mockPosts[postIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockPosts[postIndex];
  }

  async deletePost(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const postIndex = mockPosts.findIndex(post => post.id === id);
    if (postIndex !== -1) {
      mockPosts.splice(postIndex, 1);
    }
  }

  async likePost(postId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
      post.updatedAt = new Date().toISOString();
    }
  }

  async addComment(postId: string, content: string): Promise<Comment> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      content,
      author: {
        id: "student1",
        username: "jane.smith",
        firstName: "Jane",
        lastName: "Smith",
        role: "student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
    };

    post.comments.push(newComment);
    post.updatedAt = new Date().toISOString();

    return newComment;
  }

  async getComments(postId: string): Promise<Comment[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const post = mockPosts.find(p => p.id === postId);
    return post?.comments || [];
  }

  async likeComment(commentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Find comment in any post
    for (const post of mockPosts) {
      const comment = post.comments.find(c => c.id === commentId);
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likesCount += comment.isLiked ? 1 : -1;
        comment.updatedAt = new Date().toISOString();
        post.updatedAt = new Date().toISOString();
        break;
      }
    }
  }
}

export const mockPostService = new MockPostService();
