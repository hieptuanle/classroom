import { atom } from "jotai";

// Theme state
export const themeAtom = atom<"light" | "dark" | "system">("system");

// UI state atoms
export const isLoadingAtom = atom(false);
export const showWelcomeAtom = atom(true);

// User preferences
export const userPreferencesAtom = atom({
  notifications: true,
  autoRefresh: true,
  compactView: false,
});

// Navigation state
export const activeTabAtom = atom("home");

// Form state
export const loginFormAtom = atom({
  username: "",
  password: "",
  rememberMe: false,
});

export const registerFormAtom = atom({
  username: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  email: "",
});

// Derived atoms
export const isValidLoginAtom = atom((get) => {
  const form = get(loginFormAtom);
  return form.username.length >= 3 && form.password.length >= 6;
});

export const isValidRegisterAtom = atom((get) => {
  const form = get(registerFormAtom);
  return (
    form.username.length >= 3
    && form.password.length >= 6
    && form.password === form.confirmPassword
    && form.fullName.length >= 2
    && form.email.includes("@")
  );
});

// Counter example for demo
export const counterAtom = atom(0);
export const doubleCountAtom = atom(get => get(counterAtom) * 2);

// Async atom example
export const asyncCounterAtom = atom(
  get => get(counterAtom),
  async (get, set, newValue: number | ((prev: number) => number)) => {
    const currentValue = get(counterAtom);
    const nextValue = typeof newValue === "function" ? newValue(currentValue) : newValue;

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    set(counterAtom, nextValue);
  },
);
