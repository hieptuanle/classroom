import { createStore } from "jotai";

import {
  activeTabAtom,
  asyncCounterAtom,
  counterAtom,
  doubleCountAtom,
  isLoadingAtom,
  isValidLoginAtom,
  isValidRegisterAtom,
  loginFormAtom,
  registerFormAtom,
  showWelcomeAtom,
  themeAtom,
  userPreferencesAtom,
} from "../atoms";

describe("jotai Atoms", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe("basic atoms", () => {
    it("should have correct initial values", () => {
      expect(store.get(themeAtom)).toBe("system");
      expect(store.get(isLoadingAtom)).toBe(false);
      expect(store.get(showWelcomeAtom)).toBe(true);
      expect(store.get(activeTabAtom)).toBe("home");
      expect(store.get(counterAtom)).toBe(0);
    });

    it("should update theme atom", () => {
      store.set(themeAtom, "dark");
      expect(store.get(themeAtom)).toBe("dark");

      store.set(themeAtom, "light");
      expect(store.get(themeAtom)).toBe("light");
    });

    it("should update loading state", () => {
      store.set(isLoadingAtom, true);
      expect(store.get(isLoadingAtom)).toBe(true);

      store.set(isLoadingAtom, false);
      expect(store.get(isLoadingAtom)).toBe(false);
    });

    it("should update welcome visibility", () => {
      store.set(showWelcomeAtom, false);
      expect(store.get(showWelcomeAtom)).toBe(false);

      store.set(showWelcomeAtom, true);
      expect(store.get(showWelcomeAtom)).toBe(true);
    });

    it("should update counter", () => {
      store.set(counterAtom, 5);
      expect(store.get(counterAtom)).toBe(5);

      store.set(counterAtom, 10);
      expect(store.get(counterAtom)).toBe(10);
    });
  });

  describe("object atoms", () => {
    it("should have correct initial user preferences", () => {
      const preferences = store.get(userPreferencesAtom);
      expect(preferences).toEqual({
        notifications: true,
        autoRefresh: true,
        compactView: false,
      });
    });

    it("should update user preferences", () => {
      const newPreferences = {
        notifications: false,
        autoRefresh: false,
        compactView: true,
      };

      store.set(userPreferencesAtom, newPreferences);
      expect(store.get(userPreferencesAtom)).toEqual(newPreferences);
    });

    it("should have correct initial login form", () => {
      const loginForm = store.get(loginFormAtom);
      expect(loginForm).toEqual({
        username: "",
        password: "",
        rememberMe: false,
      });
    });

    it("should update login form", () => {
      const newForm = {
        username: "testuser",
        password: "password123",
        rememberMe: true,
      };

      store.set(loginFormAtom, newForm);
      expect(store.get(loginFormAtom)).toEqual(newForm);
    });

    it("should have correct initial register form", () => {
      const registerForm = store.get(registerFormAtom);
      expect(registerForm).toEqual({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        email: "",
      });
    });

    it("should update register form", () => {
      const newForm = {
        username: "newuser",
        password: "securepass",
        confirmPassword: "securepass",
        fullName: "John Doe",
        email: "john@example.com",
      };

      store.set(registerFormAtom, newForm);
      expect(store.get(registerFormAtom)).toEqual(newForm);
    });
  });

  describe("derived atoms", () => {
    it("should calculate double count correctly", () => {
      store.set(counterAtom, 5);
      expect(store.get(doubleCountAtom)).toBe(10);

      store.set(counterAtom, 0);
      expect(store.get(doubleCountAtom)).toBe(0);

      store.set(counterAtom, -3);
      expect(store.get(doubleCountAtom)).toBe(-6);
    });

    it("should validate login form correctly", () => {
      // Invalid cases
      expect(store.get(isValidLoginAtom)).toBe(false);

      store.set(loginFormAtom, { username: "ab", password: "12345", rememberMe: false });
      expect(store.get(isValidLoginAtom)).toBe(false);

      store.set(loginFormAtom, { username: "abc", password: "12345", rememberMe: false });
      expect(store.get(isValidLoginAtom)).toBe(false);

      // Valid case
      store.set(loginFormAtom, { username: "abc", password: "123456", rememberMe: false });
      expect(store.get(isValidLoginAtom)).toBe(true);

      store.set(loginFormAtom, { username: "testuser", password: "verylongpassword", rememberMe: true });
      expect(store.get(isValidLoginAtom)).toBe(true);
    });

    it("should validate register form correctly", () => {
      // Invalid cases
      expect(store.get(isValidRegisterAtom)).toBe(false);

      store.set(registerFormAtom, {
        username: "ab",
        password: "123456",
        confirmPassword: "123456",
        fullName: "John",
        email: "john@example.com",
      });
      expect(store.get(isValidRegisterAtom)).toBe(false);

      store.set(registerFormAtom, {
        username: "abc",
        password: "12345",
        confirmPassword: "12345",
        fullName: "John",
        email: "john@example.com",
      });
      expect(store.get(isValidRegisterAtom)).toBe(false);

      store.set(registerFormAtom, {
        username: "abc",
        password: "123456",
        confirmPassword: "123457",
        fullName: "John",
        email: "john@example.com",
      });
      expect(store.get(isValidRegisterAtom)).toBe(false);

      store.set(registerFormAtom, {
        username: "abc",
        password: "123456",
        confirmPassword: "123456",
        fullName: "J",
        email: "john@example.com",
      });
      expect(store.get(isValidRegisterAtom)).toBe(false);

      store.set(registerFormAtom, {
        username: "abc",
        password: "123456",
        confirmPassword: "123456",
        fullName: "John",
        email: "johnexample.com",
      });
      expect(store.get(isValidRegisterAtom)).toBe(false);

      // Valid case
      store.set(registerFormAtom, {
        username: "abc",
        password: "123456",
        confirmPassword: "123456",
        fullName: "John",
        email: "john@example.com",
      });
      expect(store.get(isValidRegisterAtom)).toBe(true);
    });
  });

  describe("async atoms", () => {
    it("should handle async counter updates", async () => {
      expect(store.get(asyncCounterAtom)).toBe(0);

      // Test setting a direct value
      await store.set(asyncCounterAtom, 5);
      expect(store.get(counterAtom)).toBe(5);
      expect(store.get(asyncCounterAtom)).toBe(5);

      // Test setting with a function
      await store.set(asyncCounterAtom, prev => prev + 3);
      expect(store.get(counterAtom)).toBe(8);
      expect(store.get(asyncCounterAtom)).toBe(8);
    });

    it("should simulate async delay in async counter", async () => {
      const startTime = Date.now();
      await store.set(asyncCounterAtom, 1);
      const endTime = Date.now();

      // Should take at least 100ms due to the setTimeout
      expect(endTime - startTime).toBeGreaterThanOrEqual(90); // Allow for some variance
    });
  });

  describe("state isolation", () => {
    it("should maintain separate state across different stores", () => {
      const store1 = createStore();
      const store2 = createStore();

      store1.set(counterAtom, 10);
      store2.set(counterAtom, 20);

      expect(store1.get(counterAtom)).toBe(10);
      expect(store2.get(counterAtom)).toBe(20);
    });

    it("should have independent derived atoms across stores", () => {
      const store1 = createStore();
      const store2 = createStore();

      store1.set(counterAtom, 5);
      store2.set(counterAtom, 7);

      expect(store1.get(doubleCountAtom)).toBe(10);
      expect(store2.get(doubleCountAtom)).toBe(14);
    });
  });
});
