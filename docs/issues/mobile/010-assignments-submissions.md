# Issue #10: Implement Mobile Assignment and Submission System

## Description

Implement mobile assignment management including assignment viewing, student submissions, teacher grading, and assignment organization features.

## Requirements

- Assignment list with filtering and categories
- Assignment detail view with instructions
- Student submission interface
- Teacher grading and feedback system
- Assignment creation and editing (teachers)
- File upload for submissions
- Grade viewing and feedback
- Assignment organization with topics

## Acceptance Criteria

- [ ] Assignment list screen with category filters
- [ ] Assignment detail view with submission status
- [ ] Student submission form with file uploads
- [ ] Teacher grading interface with rubrics
- [ ] Assignment creation form (teachers)
- [ ] Grade book view for teachers
- [ ] To-do list integration for students
- [ ] Category/topic management
- [ ] Offline support for viewing assignments
- [ ] Push notifications for due dates
- [ ] Bulk grading capabilities

## Implementation Plan

1. **Assignment List**: Categorized assignment view
2. **Assignment Detail**: Full assignment view with submission
3. **Submission System**: Multi-format submission interface
4. **Grading Interface**: Teacher grading with feedback
5. **Assignment Creation**: Full assignment composer
6. **Grade Management**: Grade book and analytics
7. **Category System**: Assignment organization
8. **Notification System**: Due date reminders
9. **State Management**: Assignment data with caching
10. **Testing**: Component and integration tests

## Screen Specifications

### Assignment List (`/classes/[id]/assignments`)

- Category tabs for organization
- Assignment cards with due dates and status
- Filter options (assigned, graded, missing)
- Search functionality
- FAB for creating assignments (teachers)
- Progress indicators for submissions

### Assignment Detail (`/assignments/[id]`)

- Assignment instructions and requirements
- Due date and submission status
- Attachment downloads
- Submission interface (students)
- Grading interface (teachers)
- Previous submissions history

### Submission Interface (Students)

- Text submission editor
- File attachment picker
- Camera integration for photos
- Link submission form
- Submission confirmation
- Edit submission before due date

### Grading Interface (Teachers)

- Student submission list
- Individual submission view
- Scoring rubric interface
- Feedback text editor
- Bulk grading options
- Grade distribution analytics

### Assignment Creation (`/assignments/create`)

- Assignment details form
- Instructions rich text editor
- Due date and time picker
- Rubric creator
- File attachment options
- Category selection
- Student targeting

## Component Structure

### AssignmentCard Component

```typescript
type AssignmentCardProps = {
  assignment: Assignment;
  userRole: "teacher" | "student";
  submissionStatus?: SubmissionStatus;
  onPress: () => void;
};
```

### SubmissionForm Component

```typescript
type SubmissionFormProps = {
  assignment: Assignment;
  existingSubmission?: Submission;
  onSubmit: (data: SubmissionData) => void;
  isLoading: boolean;
};
```

### GradingInterface Component

```typescript
type GradingInterfaceProps = {
  assignment: Assignment;
  submissions: Submission[];
  onGrade: (submissionId: string, grade: Grade) => void;
  onBulkGrade: (grades: BulkGrade[]) => void;
};
```

### RubricCreator Component

```typescript
type RubricCreatorProps = {
  rubric?: Rubric;
  onChange: (rubric: Rubric) => void;
  maxPoints: number;
};
```

## State Management

### Assignment Queries (TanStack Query)

```typescript
// Get assignments for a class
function useAssignments(classId: string, filter?: AssignmentFilter) {
  return useQuery({
    queryKey: ["assignments", classId, filter],
    queryFn: () => assignmentService.getAssignments(classId, filter)
  });
}

// Get assignment details
function useAssignment(assignmentId: string) {
  return useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => assignmentService.getAssignment(assignmentId)
  });
}

// Get submissions for assignment (teachers)
function useSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: ["submissions", assignmentId],
    queryFn: () => submissionService.getSubmissions(assignmentId)
  });
}

// Submit assignment (students)
function useSubmitAssignment() {
  return useMutation({
    mutationFn: submissionService.submitAssignment,
    onSuccess: (submission) => {
      queryClient.invalidateQueries(["assignment", submission.assignmentId]);
      queryClient.invalidateQueries(["submissions", submission.assignmentId]);
    }
  });
}

// Grade submission (teachers)
function useGradeSubmission() {
  return useMutation({
    mutationFn: submissionService.gradeSubmission,
    onSuccess: (gradedSubmission) => {
      queryClient.invalidateQueries(["submissions", gradedSubmission.assignmentId]);
    }
  });
}
```

### Assignment State (Jotai)

```typescript
// Selected assignment for details
export const selectedAssignmentAtom = atom<Assignment | null>(null);

// Assignment filter state
export const assignmentFilterAtom = atom<AssignmentFilter>({
  status: "all",
  category: "all",
  dueDate: "all"
});

// Submission draft state
export const submissionDraftAtom = atom<Partial<SubmissionData>>({});

// Grading state
export const gradingModeAtom = atom<"individual" | "bulk">("individual");
```

## Assignment Types and Data

### Assignment Model

```typescript
type Assignment = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  type: "exercise" | "test" | "question" | "document";
  classId: string;
  categoryId?: string;
  authorId: string;
  dueDate: Date;
  maxScore: number;
  rubric?: Rubric;
  attachments: Attachment[];
  allowLateSubmission: boolean;
  submissionTypes: SubmissionType[];
  createdAt: Date;
  updatedAt: Date;
};
```

### Submission Model

```typescript
type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  attachments: Attachment[];
  submissionType: SubmissionType;
  status: "draft" | "submitted" | "graded" | "returned";
  score?: number;
  maxScore: number;
  feedback?: string;
  rubricGrades?: RubricGrade[];
  submittedAt?: Date;
  gradedAt?: Date;
  isLate: boolean;
};
```

### Rubric Model

```typescript
type Rubric = {
  id: string;
  criteria: RubricCriterion[];
  totalPoints: number;
};

type RubricCriterion = {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
};

type RubricLevel = {
  id: string;
  name: string;
  description: string;
  points: number;
};
```

## Submission Types

### Supported Submission Types

```typescript
type SubmissionType =
  | "text" // Rich text submission
  | "file" // File upload
  | "image" // Image from camera/gallery
  | "video" // Video recording
  | "audio" // Audio recording
  | "link" // External link
  | "code"; // Code with syntax highlighting
```

### File Upload Specifications

- **Images**: JPEG, PNG, GIF (max 10MB each)
- **Documents**: PDF, DOC, DOCX, TXT (max 50MB each)
- **Videos**: MP4, MOV (max 100MB each)
- **Audio**: MP3, WAV, M4A (max 25MB each)
- **Code**: All text-based programming files

## Grading Features

### Grading Options

- Numeric scores (0-100 or custom scale)
- Letter grades (A-F with +/-)
- Rubric-based grading
- Pass/fail assessment
- Custom grading scales

### Feedback Types

- Written comments
- Audio feedback recording
- Inline document annotations
- Rubric criterion feedback
- Overall performance notes

## Notification System

### Assignment Notifications

- New assignment posted
- Assignment due reminder (24h, 1h)
- Grade published notification
- Late submission alerts
- Assignment updates/changes

## API Integration

### Assignment Service

```typescript
class AssignmentService {
  async getAssignments(classId: string, filter?: AssignmentFilter): Promise<Assignment[]>;
  async getAssignment(id: string): Promise<Assignment>;
  async createAssignment(data: CreateAssignmentData): Promise<Assignment>;
  async updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment>;
  async deleteAssignment(id: string): Promise<void>;
}
```

### Submission Service

```typescript
class SubmissionService {
  async getSubmissions(assignmentId: string): Promise<Submission[]>;
  async getMySubmission(assignmentId: string): Promise<Submission | null>;
  async submitAssignment(data: SubmissionData): Promise<Submission>;
  async updateSubmission(id: string, data: Partial<SubmissionData>): Promise<Submission>;
  async gradeSubmission(id: string, grade: GradeData): Promise<Submission>;
  async bulkGrade(grades: BulkGradeData[]): Promise<Submission[]>;
}
```

## Dependencies

- Issue #8: Mobile Class Management
- Issue #9: Mobile Announcements and Posts
- Backend Issue #5: Assignment System
- Backend Issue #6: File Upload System

## Priority

High

## Estimated Time

7-8 days

## Labels

- mobile
- assignments
- grading
- submissions
- high-priority
