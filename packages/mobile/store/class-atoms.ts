import { atom } from "jotai";

import type { Class, ClassFilter } from "@/types/class";

// Selected class for navigation
export const selectedClassAtom = atom<Class | null>(null);

// Class creation modal state
export const createClassModalAtom = atom(false);

// Join class modal state
export const joinClassModalAtom = atom(false);

// Class filter state
export const classFilterAtom = atom<ClassFilter>("teaching");

// Search query for classes
export const classSearchAtom = atom("");

// Class form data for creation/editing
export const classFormAtom = atom({
  name: "",
  subject: "",
  section: "",
  room: "",
  description: "",
});

// Reset class form
export const resetClassFormAtom = atom(null, (get, set) => {
  set(classFormAtom, {
    name: "",
    subject: "",
    section: "",
    room: "",
    description: "",
  });
});

// Current user role for determining UI features
export const userRoleAtom = atom<"teacher" | "student">("student");
