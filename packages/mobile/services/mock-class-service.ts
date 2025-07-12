import type { Class, ClassFilter, ClassForm } from "@/types/class";

// Mock data for development
const mockClasses: Class[] = [
  {
    id: "1",
    name: "Advanced React Native",
    subject: "Computer Science",
    section: "CS-401",
    room: "Room 101",
    description: "Learn advanced React Native concepts and patterns",
    inviteCode: "ABC123",
    archived: false,
    teachers: [
      {
        id: "teacher1",
        username: "john.doe",
        firstName: "John",
        lastName: "Doe",
        role: "teacher",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
    ],
    students: [
      {
        id: "student1",
        username: "jane.smith",
        firstName: "Jane",
        lastName: "Smith",
        role: "student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
      {
        id: "student2",
        username: "bob.wilson",
        firstName: "Bob",
        lastName: "Wilson",
        role: "student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },
  {
    id: "2",
    name: "Database Design",
    subject: "Computer Science",
    section: "CS-301",
    room: "Room 205",
    description: "Fundamentals of database design and SQL",
    inviteCode: "DEF456",
    archived: false,
    teachers: [
      {
        id: "teacher2",
        username: "sarah.johnson",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "teacher",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
    ],
    students: [
      {
        id: "student1",
        username: "jane.smith",
        firstName: "Jane",
        lastName: "Smith",
        role: "student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
    ],
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-05T11:45:00Z",
  },
  {
    id: "3",
    name: "Web Development Basics",
    subject: "Computer Science",
    section: "CS-101",
    room: "Lab 3",
    archived: true,
    teachers: [
      {
        id: "teacher1",
        username: "john.doe",
        firstName: "John",
        lastName: "Doe",
        role: "teacher",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
    ],
    students: [],
    createdAt: "2023-09-01T08:00:00Z",
    updatedAt: "2023-12-15T16:00:00Z",
  },
];

class MockClassService {
  async getClasses(filter: ClassFilter): Promise<Class[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    switch (filter) {
      case "teaching":
        // Return classes where current user is a teacher
        return mockClasses.filter(cls => !cls.archived
          && cls.teachers.some(teacher => teacher.id === "teacher1")); // Mock current user as teacher1
      case "enrolled":
        // Return classes where current user is a student
        return mockClasses.filter(cls => !cls.archived
          && cls.students.some(student => student.id === "student1")); // Mock current user as student1
      case "archived":
        return mockClasses.filter(cls => cls.archived);
      default:
        return mockClasses.filter(cls => !cls.archived);
    }
  }

  async getClass(id: string): Promise<Class | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockClasses.find(cls => cls.id === id) || null;
  }

  async createClass(data: ClassForm): Promise<Class> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newClass: Class = {
      id: Date.now().toString(),
      ...data,
      inviteCode: this.createInviteCode(),
      archived: false,
      teachers: [
        {
          id: "teacher1",
          username: "john.doe",
          firstName: "John",
          lastName: "Doe",
          role: "teacher",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        },
      ],
      students: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockClasses.push(newClass);
    return newClass;
  }

  async updateClass(id: string, data: Partial<ClassForm>): Promise<Class> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const classIndex = mockClasses.findIndex(cls => cls.id === id);
    if (classIndex === -1) {
      throw new Error("Class not found");
    }

    mockClasses[classIndex] = {
      ...mockClasses[classIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockClasses[classIndex];
  }

  async archiveClass(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const classIndex = mockClasses.findIndex(cls => cls.id === id);
    if (classIndex !== -1) {
      mockClasses[classIndex].archived = true;
      mockClasses[classIndex].updatedAt = new Date().toISOString();
    }
  }

  async joinClass(code: string): Promise<Class> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundClass = mockClasses.find(cls => cls.inviteCode === code && !cls.archived);
    if (!foundClass) {
      throw new Error("Invalid class code");
    }

    // Add current user as student if not already enrolled
    const currentUserId = "student1"; // Mock current user
    const isAlreadyEnrolled = foundClass.students.some(student => student.id === currentUserId);

    if (!isAlreadyEnrolled) {
      foundClass.students.push({
        id: currentUserId,
        username: "jane.smith",
        firstName: "Jane",
        lastName: "Smith",
        role: "student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      });
      foundClass.updatedAt = new Date().toISOString();
    }

    return foundClass;
  }

  async generateInviteCode(_classId?: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.createInviteCode();
  }

  private createInviteCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export const mockClassService = new MockClassService();
