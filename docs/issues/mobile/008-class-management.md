# Issue #8: Implement Mobile Class Management

## Description

Implement mobile class management functionality including class list, class creation, joining classes, and class detail views for teachers and students.

## Requirements

- Class list with teaching/enrolled filters
- Class creation form (teachers only)
- Join class by code functionality
- Class detail view with tabs
- Class settings and management
- Class member management
- Class invitation sharing

## Acceptance Criteria

- [ ] Classes list screen with filter tabs
- [ ] Class creation modal/screen (teachers)
- [ ] Join class modal with code input
- [ ] Class detail screen with tab navigation
- [ ] Class settings screen (teachers)
- [ ] Class members list and management
- [ ] Class invitation code sharing
- [ ] Archive/unarchive class functionality
- [ ] Loading states and error handling
- [ ] Pull-to-refresh functionality
- [ ] Responsive design and accessibility

## Implementation Plan

1. **Class List Screen**: Display classes with filters
2. **Class Creation**: Form for creating new classes
3. **Join Class**: Modal for joining by code
4. **Class Detail**: Tabbed view with announcements/assignments
5. **Class Settings**: Management options for teachers
6. **Member Management**: View and manage class members
7. **Invitation System**: Share class codes
8. **Archive System**: Archive/restore classes
9. **State Management**: Class data with TanStack Query
10. **Testing**: Component and integration tests

## Screen Specifications

### Classes List Screen (`/(tabs)/classes`)

- Tab navigation: "Teaching" / "Enrolled" / "Archived"
- Class cards with name, subject, section info
- FAB for creating new class (teachers only)
- Join class button in header
- Pull-to-refresh functionality
- Empty state illustrations
- Search/filter functionality

### Class Creation Modal (`/classes/create`)

```typescript
type ClassForm = {
  name: string;
  subject: string;
  section: string;
  room: string;
  description?: string;
};
```

### Join Class Modal (`/classes/join`)

- Text input for class code
- Camera scanner for QR codes (future)
- Join button with validation
- Error handling for invalid codes

### Class Detail Screen (`/classes/[id]`)

- Header with class info and menu
- Tab navigation:
  - Stream (Announcements)
  - Assignments
  - Members
  - About (class info)

### Class Settings Screen (`/classes/[id]/settings`)

- Class information editing
- Archive/delete class options
- Invitation management
- Member permissions
- Notification settings

## Component Structure

### ClassCard Component

```typescript
type ClassCardProps = {
  class: Class;
  onPress: () => void;
  showRole?: boolean;
  showMenu?: boolean;
};
```

### ClassCreateForm Component

```typescript
type ClassCreateFormProps = {
  onSubmit: (data: ClassForm) => void;
  isLoading: boolean;
  onCancel: () => void;
};
```

### JoinClassModal Component

```typescript
type JoinClassModalProps = {
  visible: boolean;
  onJoin: (code: string) => void;
  onClose: () => void;
  isLoading: boolean;
};
```

## State Management

### Class Queries (TanStack Query)

```typescript
// Get classes with filters
function useClasses(filter: "teaching" | "enrolled" | "archived") {
  return useQuery({
    queryKey: ["classes", filter],
    queryFn: () => classService.getClasses(filter)
  });
}

// Get class details
function useClass(classId: string) {
  return useQuery({
    queryKey: ["class", classId],
    queryFn: () => classService.getClass(classId)
  });
}

// Create class mutation
function useCreateClass() {
  return useMutation({
    mutationFn: classService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
    }
  });
}

// Join class mutation
function useJoinClass() {
  return useMutation({
    mutationFn: classService.joinClass,
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
    }
  });
}
```

### UI State (Jotai)

```typescript
// Selected class for navigation
export const selectedClassAtom = atom<Class | null>(null);

// Class creation modal state
export const createClassModalAtom = atom(false);

// Join class modal state
export const joinClassModalAtom = atom(false);

// Class filter state
export const classFilterAtom = atom<"teaching" | "enrolled" | "archived">("teaching");
```

## API Integration

### Class Service

```typescript
class ClassService {
  async getClasses(filter: string): Promise<Class[]>;
  async getClass(id: string): Promise<Class>;
  async createClass(data: ClassForm): Promise<Class>;
  async updateClass(id: string, data: Partial<ClassForm>): Promise<Class>;
  async archiveClass(id: string): Promise<void>;
  async joinClass(code: string): Promise<Class>;
  async generateInviteCode(classId: string): Promise<string>;
}
```

## Dependencies

- Issue #7: Mobile Authentication and Navigation
- Backend Issue #3: Class Management System

## Priority

High

## Estimated Time

5-6 days

## Labels

- mobile
- class-management
- high-priority
