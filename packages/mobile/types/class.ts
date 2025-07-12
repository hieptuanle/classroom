export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: "teacher" | "student";
};

export type Class = {
  id: string;
  name: string;
  subject: string;
  section: string;
  room: string;
  description?: string;
  inviteCode?: string;
  archived: boolean;
  teachers: User[];
  students: User[];
  createdAt: string;
  updatedAt: string;
};

export type ClassForm = {
  name: string;
  subject: string;
  section: string;
  room: string;
  description?: string;
};

export type ClassFilter = "teaching" | "enrolled" | "archived";

export type ClassCardProps = {
  class: Class;
  onPress: () => void;
  showRole?: boolean;
  showMenu?: boolean;
  userRole?: "teacher" | "student";
};

export type ClassCreateFormProps = {
  onSubmit: (data: ClassForm) => void;
  isLoading: boolean;
  onCancel: () => void;
};

export type JoinClassModalProps = {
  visible: boolean;
  onJoin: (code: string) => void;
  onClose: () => void;
  isLoading: boolean;
};
