import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Provider as JotaiProvider } from "jotai";
import React from "react";
import { Pressable, Text, View } from "react-native";

import {
  asyncCounterAtom,
  counterAtom,
  doubleCountAtom,
  isValidLoginAtom,
  loginFormAtom,
  showWelcomeAtom,
  useAtom,
  useAtomValue,
  userPreferencesAtom,
  useSetAtom,
} from "../index";

// Test component that uses multiple atoms
function TestComponent() {
  const [counter, setCounter] = useAtom(counterAtom);
  const doubleCount = useAtomValue(doubleCountAtom);
  const setAsyncCounter = useSetAtom(asyncCounterAtom);
  const [showWelcome, setShowWelcome] = useAtom(showWelcomeAtom);
  const [preferences, setPreferences] = useAtom(userPreferencesAtom);
  const [loginForm, setLoginForm] = useAtom(loginFormAtom);
  const isValidLogin = useAtomValue(isValidLoginAtom);

  const handleAsyncIncrement = async () => {
    await setAsyncCounter(prev => prev + 1);
  };

  return (
    <View>
      <Text testID="counter">{counter}</Text>
      <Text testID="doubleCount">
        Double:
        {doubleCount}
      </Text>

      <Pressable testID="increment" onPress={() => setCounter(prev => prev + 1)}>
        <Text>+</Text>
      </Pressable>

      <Pressable testID="decrement" onPress={() => setCounter(prev => prev - 1)}>
        <Text>-</Text>
      </Pressable>

      <Pressable testID="asyncIncrement" onPress={handleAsyncIncrement}>
        <Text>Async +1</Text>
      </Pressable>

      <Text testID="welcome">
        Welcome:
        {showWelcome ? "Shown" : "Hidden"}
      </Text>
      <Pressable testID="toggleWelcome" onPress={() => setShowWelcome(!showWelcome)}>
        <Text>Toggle Welcome</Text>
      </Pressable>

      <Text testID="notifications">
        Notifications:
        {" "}
        {preferences.notifications ? "On" : "Off"}
      </Text>
      <Pressable
        testID="toggleNotifications"
        onPress={() => setPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
      >
        <Text>Toggle Notifications</Text>
      </Pressable>

      <Text testID="username">{loginForm.username}</Text>
      <Text testID="password">{loginForm.password}</Text>
      <Text testID="isValidLogin">{isValidLogin ? "Valid" : "Invalid"}</Text>

      <Pressable
        testID="setUsername"
        onPress={() => setLoginForm(prev => ({ ...prev, username: "testuser" }))}
      >
        <Text>Set Username</Text>
      </Pressable>

      <Pressable
        testID="setPassword"
        onPress={() => setLoginForm(prev => ({ ...prev, password: "password123" }))}
      >
        <Text>Set Password</Text>
      </Pressable>
    </View>
  );
}

function renderWithJotai(component: React.ReactElement) {
  return render(
    <JotaiProvider>
      {component}
    </JotaiProvider>,
  );
}

describe("jotai Integration Tests", () => {
  it("should handle basic counter operations", () => {
    const { getByTestId } = renderWithJotai(<TestComponent />);

    // Initial state
    expect(getByTestId("counter")).toHaveTextContent("0");
    expect(getByTestId("doubleCount")).toHaveTextContent("Double:0");

    // Increment
    fireEvent.press(getByTestId("increment"));
    expect(getByTestId("counter")).toHaveTextContent("1");
    expect(getByTestId("doubleCount")).toHaveTextContent("Double:2");

    // Increment again
    fireEvent.press(getByTestId("increment"));
    expect(getByTestId("counter")).toHaveTextContent("2");
    expect(getByTestId("doubleCount")).toHaveTextContent("Double:4");

    // Decrement
    fireEvent.press(getByTestId("decrement"));
    expect(getByTestId("counter")).toHaveTextContent("1");
    expect(getByTestId("doubleCount")).toHaveTextContent("Double:2");
  });

  it("should handle async counter operations", async () => {
    const { getByTestId } = renderWithJotai(<TestComponent />);

    expect(getByTestId("counter")).toHaveTextContent("0");

    fireEvent.press(getByTestId("asyncIncrement"));

    await waitFor(() => {
      expect(getByTestId("counter")).toHaveTextContent("1");
    });

    expect(getByTestId("doubleCount")).toHaveTextContent("Double:2");
  });

  it("should handle UI state changes", () => {
    const { getByTestId } = renderWithJotai(<TestComponent />);

    // Initial state
    expect(getByTestId("welcome")).toHaveTextContent("Welcome:Shown");

    // Toggle welcome
    fireEvent.press(getByTestId("toggleWelcome"));
    expect(getByTestId("welcome")).toHaveTextContent("Welcome:Hidden");

    // Toggle back
    fireEvent.press(getByTestId("toggleWelcome"));
    expect(getByTestId("welcome")).toHaveTextContent("Welcome:Shown");
  });

  it("should handle user preferences", () => {
    const { getByTestId } = renderWithJotai(<TestComponent />);

    // Initial state
    expect(getByTestId("notifications")).toHaveTextContent("Notifications: On");

    // Toggle notifications
    fireEvent.press(getByTestId("toggleNotifications"));
    expect(getByTestId("notifications")).toHaveTextContent("Notifications: Off");

    // Toggle back
    fireEvent.press(getByTestId("toggleNotifications"));
    expect(getByTestId("notifications")).toHaveTextContent("Notifications: On");
  });

  it("should handle form validation with derived atoms", () => {
    const { getByTestId } = renderWithJotai(<TestComponent />);

    // Initial state - invalid
    expect(getByTestId("username")).toHaveTextContent("");
    expect(getByTestId("password")).toHaveTextContent("");
    expect(getByTestId("isValidLogin")).toHaveTextContent("Invalid");

    // Set username only - still invalid
    fireEvent.press(getByTestId("setUsername"));
    expect(getByTestId("username")).toHaveTextContent("testuser");
    expect(getByTestId("isValidLogin")).toHaveTextContent("Invalid");

    // Set password - now valid
    fireEvent.press(getByTestId("setPassword"));
    expect(getByTestId("password")).toHaveTextContent("password123");
    expect(getByTestId("isValidLogin")).toHaveTextContent("Valid");
  });

  it("should maintain state across multiple interactions", () => {
    const { getByTestId } = renderWithJotai(<TestComponent />);

    // Perform multiple operations
    fireEvent.press(getByTestId("increment"));
    fireEvent.press(getByTestId("increment"));
    fireEvent.press(getByTestId("toggleWelcome"));
    fireEvent.press(getByTestId("toggleNotifications"));
    fireEvent.press(getByTestId("setUsername"));

    // Check all states are maintained
    expect(getByTestId("counter")).toHaveTextContent("2");
    expect(getByTestId("doubleCount")).toHaveTextContent("Double:4");
    expect(getByTestId("welcome")).toHaveTextContent("Welcome:Hidden");
    expect(getByTestId("notifications")).toHaveTextContent("Notifications: Off");
    expect(getByTestId("username")).toHaveTextContent("testuser");
    expect(getByTestId("isValidLogin")).toHaveTextContent("Invalid"); // Still invalid without password

    // Add password to make it valid
    fireEvent.press(getByTestId("setPassword"));
    expect(getByTestId("isValidLogin")).toHaveTextContent("Valid");
  });

  it("should handle rapid state changes", () => {
    const { getByTestId } = renderWithJotai(<TestComponent />);

    // Rapid increments
    for (let i = 0; i < 10; i++) {
      fireEvent.press(getByTestId("increment"));
    }

    expect(getByTestId("counter")).toHaveTextContent("10");
    expect(getByTestId("doubleCount")).toHaveTextContent("Double:20");

    // Rapid decrements
    for (let i = 0; i < 5; i++) {
      fireEvent.press(getByTestId("decrement"));
    }

    expect(getByTestId("counter")).toHaveTextContent("5");
    expect(getByTestId("doubleCount")).toHaveTextContent("Double:10");
  });

  it("should handle multiple async operations", async () => {
    const { getByTestId } = renderWithJotai(<TestComponent />);

    // Multiple async increments - do them sequentially to avoid race conditions
    fireEvent.press(getByTestId("asyncIncrement"));
    await waitFor(() => {
      expect(getByTestId("counter")).toHaveTextContent("1");
    });

    fireEvent.press(getByTestId("asyncIncrement"));
    await waitFor(() => {
      expect(getByTestId("counter")).toHaveTextContent("2");
    });

    fireEvent.press(getByTestId("asyncIncrement"));
    await waitFor(() => {
      expect(getByTestId("counter")).toHaveTextContent("3");
    });

    expect(getByTestId("doubleCount")).toHaveTextContent("Double:6");
  });
});
