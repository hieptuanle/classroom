# Issue #11: Implement Mobile Profile and Settings

## Description

Implement mobile user profile management and application settings including profile editing, preferences, notifications, and app configuration.

## Requirements

- User profile view and editing
- Settings and preferences management
- Notification configuration
- Theme and appearance settings
- Account security settings
- Help and support sections
- App information and feedback

## Acceptance Criteria

- [ ] Profile screen with user information
- [ ] Profile editing form with avatar upload
- [ ] Settings screen with organized categories
- [ ] Notification preferences management
- [ ] Theme selection (light/dark/system)
- [ ] Password change functionality
- [ ] Help and support screens
- [ ] About app information
- [ ] Feedback submission form
- [ ] Logout functionality
- [ ] Data backup and sync settings

## Implementation Plan

1. **Profile Screen**: Display and edit user information
2. **Settings Navigation**: Organized settings categories
3. **Notification Settings**: Configure app notifications
4. **Theme Management**: Light/dark theme selection
5. **Security Settings**: Password and privacy options
6. **Help System**: Documentation and support
7. **App Information**: Version, terms, privacy policy
8. **Feedback System**: User feedback collection
9. **State Management**: Settings with persistent storage
10. **Testing**: Component and integration tests

## Screen Specifications

### Profile Screen (`/(tabs)/profile`)

- User avatar with edit option
- Name and username display
- Role badge (Teacher/Student)
- Statistics (classes, assignments, etc.)
- Quick action buttons
- Settings navigation

### Profile Edit Screen (`/profile/edit`)

- Avatar image picker and cropper
- First name and last name inputs
- Username field (with availability check)
- Email field
- Bio/description textarea
- Save/cancel buttons

### Settings Screen (`/settings`)

- Account settings section
- Notification preferences
- Theme and appearance
- Privacy and security
- Help and support
- About application

### Notification Settings (`/settings/notifications`)

- Push notification toggle
- Email notification preferences
- Assignment reminders
- Class announcement alerts
- Grade notifications
- Weekly summary emails

### Theme Settings (`/settings/theme`)

- Light theme option
- Dark theme option
- System default option
- Preview examples
- Custom color options (future)

## Component Structure

### ProfileCard Component

```typescript
type ProfileCardProps = {
  user: User;
  onEdit: () => void;
  showStats?: boolean;
  editable?: boolean;
};
```

### AvatarPicker Component

```typescript
type AvatarPickerProps = {
  currentAvatar?: string;
  onImageSelected: (imageUri: string) => void;
  size?: number;
  editable?: boolean;
};
```

### SettingsSection Component

```typescript
type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
  icon?: string;
  collapsible?: boolean;
};
```

### SettingsItem Component

```typescript
type SettingsItemProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};
```

## State Management

### User Profile Queries (TanStack Query)

```typescript
// Get current user profile
function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: userService.getProfile
  });
}

// Update profile mutation
function useUpdateProfile() {
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile"], updatedUser);
      queryClient.invalidateQueries(["user", updatedUser.id]);
    }
  });
}

// Upload avatar mutation
function useUploadAvatar() {
  return useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: (avatarUrl) => {
      queryClient.invalidateQueries(["profile"]);
    }
  });
}

// Change password mutation
function useChangePassword() {
  return useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      // Show success message
    }
  });
}
```

### Settings State (Jotai with Persistence)

```typescript
// Theme preference
export const themeAtom = atomWithStorage<"light" | "dark" | "system">("theme", "system");

// Notification settings
export const notificationSettingsAtom = atomWithStorage("notifications", {
  pushEnabled: true,
  emailEnabled: true,
  assignmentReminders: true,
  gradeNotifications: true,
  classAnnouncements: true,
  weeklyDigest: false
});

// App preferences
export const appPreferencesAtom = atomWithStorage("preferences", {
  autoRefresh: true,
  offlineMode: false,
  dataUsage: "wifi-only",
  language: "en"
});

// Privacy settings
export const privacySettingsAtom = atomWithStorage("privacy", {
  profileVisibility: "class-members",
  showOnlineStatus: true,
  allowDirectMessages: true
});
```

## Settings Categories

### Account Settings

- Edit profile information
- Change password
- Email preferences
- Account privacy
- Data download/export

### Notification Preferences

```typescript
type NotificationSettings = {
  pushEnabled: boolean;
  emailEnabled: boolean;
  assignmentReminders: boolean;
  gradeNotifications: boolean;
  classAnnouncements: boolean;
  weeklyDigest: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
};
```

### Theme and Appearance

```typescript
type ThemeSettings = {
  colorScheme: "light" | "dark" | "system";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  compactMode: boolean;
};
```

### Privacy and Security

- Profile visibility settings
- Two-factor authentication
- Login activity log
- Connected apps management
- Data sharing preferences

## Avatar Management

### Avatar Upload Process

1. Image picker (camera/gallery)
2. Image cropping interface
3. Image compression
4. Upload with progress indicator
5. Update profile with new avatar URL

### Avatar Component Features

- Fallback to initials
- Loading state during upload
- Error handling for failed uploads
- Multiple size variants
- Caching for offline use

## Help and Support

### Help Documentation

- Getting started guide
- Feature tutorials
- FAQ sections
- Video guides
- Troubleshooting tips

### Support Features

- In-app feedback form
- Bug report submission
- Feature request system
- Contact support options
- Community forums link

## Notification Management

### Push Notification Types

```typescript
type NotificationTypes = {
  "assignment.due": { assignmentId: string; dueDate: Date };
  "assignment.graded": { assignmentId: string; score: number };
  "class.announcement": { classId: string; postId: string };
  "class.invitation": { classId: string; inviterName: string };
  "reminder.weekly": { summary: WeeklySummary };
};
```

### Notification Settings

- Enable/disable by category
- Quiet hours configuration
- Sound and vibration preferences
- Badge count management

## API Integration

### User Service

```typescript
class UserService {
  async getProfile(): Promise<User>;
  async updateProfile(data: Partial<User>): Promise<User>;
  async uploadAvatar(imageUri: string): Promise<string>;
  async changePassword(data: ChangePasswordData): Promise<void>;
  async getNotificationSettings(): Promise<NotificationSettings>;
  async updateNotificationSettings(settings: NotificationSettings): Promise<void>;
}
```

### Feedback Service

```typescript
class FeedbackService {
  async submitFeedback(data: FeedbackData): Promise<void>;
  async reportBug(data: BugReportData): Promise<void>;
  async requestFeature(data: FeatureRequestData): Promise<void>;
}
```

## Accessibility Features

### Accessibility Support

- Screen reader compatibility
- High contrast mode
- Large text support
- Voice navigation
- Keyboard navigation
- Color blind friendly options

## Dependencies

- Issue #7: Mobile Authentication and Navigation
- Backend Issue #2: User Management System

## Priority

Medium

## Estimated Time

4-5 days

## Labels

- mobile
- profile
- settings
- user-experience
- medium-priority
