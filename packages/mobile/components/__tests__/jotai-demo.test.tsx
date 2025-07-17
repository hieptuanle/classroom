import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Provider as JotaiProvider } from "jotai";

import {
  useAtom,
  useAtomValue,
  useSetAtom,
} from "@/store";

import { JotaiDemo } from "../../app/(drawer)/demo/-components/jotai-demo";

// Mock the store imports
jest.mock("@/store", () => ({
  useAtom: jest.fn(),
  useAtomValue: jest.fn(),
  useSetAtom: jest.fn(),
  counterAtom: "counterAtom",
  doubleCountAtom: "doubleCountAtom",
  asyncCounterAtom: "asyncCounterAtom",
  showWelcomeAtom: "showWelcomeAtom",
  userPreferencesAtom: "userPreferencesAtom",
}));

const mockUseAtom = useAtom as jest.MockedFunction<any>;
const mockUseAtomValue = useAtomValue as jest.MockedFunction<any>;
const mockUseSetAtom = useSetAtom as jest.MockedFunction<any>;

describe("jotaiDemo Component", () => {
  const mockSetCounter = jest.fn();
  const mockSetAsyncCounter = jest.fn();
  const mockSetShowWelcome = jest.fn();
  const mockSetPreferences = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset all mocks to default values
    mockUseAtom.mockReset();
    mockUseAtomValue.mockReset();
    mockUseSetAtom.mockReset();

    // Setup default mock returns
    mockUseAtom
      .mockReturnValueOnce([5, mockSetCounter]) // counter
      .mockReturnValueOnce([true, mockSetShowWelcome]) // showWelcome
      .mockReturnValueOnce([
        { notifications: true, autoRefresh: true, compactView: false },
        mockSetPreferences,
      ]); // userPreferences

    mockUseAtomValue.mockReturnValue(10); // doubleCount

    mockSetAsyncCounter.mockResolvedValue(undefined);
    mockUseSetAtom.mockReturnValue(mockSetAsyncCounter);
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <JotaiProvider>
        {component}
      </JotaiProvider>,
    );
  };

  it("renders correctly with initial state", () => {
    const { getByText } = renderWithProvider(<JotaiDemo />);

    expect(getByText("Jotai State Demo")).toBeTruthy();
    expect(getByText("Counter State:")).toBeTruthy();
    expect(getByText("5")).toBeTruthy();
    expect(getByText("Double: 10")).toBeTruthy();
    expect(getByText("Async Counter:")).toBeTruthy();
    expect(getByText("UI State:")).toBeTruthy();
    expect(getByText("Welcome: Shown")).toBeTruthy();
    expect(getByText("Preferences:")).toBeTruthy();
    expect(getByText("Notifications: On")).toBeTruthy();
  });

  it("handles counter increment", () => {
    const { getByText } = renderWithProvider(<JotaiDemo />);

    const incrementButton = getByText("+");
    fireEvent.press(incrementButton);

    expect(mockSetCounter).toHaveBeenCalledWith(expect.any(Function));

    // Test the function passed to setter
    const setterFunction = mockSetCounter.mock.calls[0][0];
    expect(setterFunction(5)).toBe(6);
  });

  it("handles counter decrement", () => {
    const { getByText } = renderWithProvider(<JotaiDemo />);

    const decrementButton = getByText("-");
    fireEvent.press(decrementButton);

    expect(mockSetCounter).toHaveBeenCalledWith(expect.any(Function));

    // Test the function passed to setter
    const setterFunction = mockSetCounter.mock.calls[0][0];
    expect(setterFunction(5)).toBe(4);
  });

  it("handles async counter increment", async () => {
    const { getByText } = renderWithProvider(<JotaiDemo />);

    const asyncButton = getByText("Async +1");
    fireEvent.press(asyncButton);

    await waitFor(() => {
      expect(mockSetAsyncCounter).toHaveBeenCalledWith(expect.any(Function));
    });

    // Test the function passed to async setter
    const setterFunction = mockSetAsyncCounter.mock.calls[0][0];
    expect(setterFunction(5)).toBe(6);
  });

  it("toggles welcome visibility", () => {
    const { getByText } = renderWithProvider(<JotaiDemo />);

    const welcomeButton = getByText("Welcome: Shown");
    fireEvent.press(welcomeButton);

    expect(mockSetShowWelcome).toHaveBeenCalledWith(false);
  });

  it("toggles notifications preference", () => {
    const { getByText } = renderWithProvider(<JotaiDemo />);

    const notificationsButton = getByText("Notifications: On");
    fireEvent.press(notificationsButton);

    expect(mockSetPreferences).toHaveBeenCalledWith(expect.any(Function));

    // Test the function passed to setter
    const setterFunction = mockSetPreferences.mock.calls[0][0];
    const newPreferences = setterFunction({
      notifications: true,
      autoRefresh: true,
      compactView: false,
    });

    expect(newPreferences).toEqual({
      notifications: false,
      autoRefresh: true,
      compactView: false,
    });
  });

  it("displays preferences status correctly", () => {
    const { getByText } = renderWithProvider(<JotaiDemo />);

    expect(getByText("Auto Refresh: On | Compact View: Off")).toBeTruthy();
  });

  describe("different state scenarios", () => {
    it("renders correctly when welcome is hidden", () => {
      // Reset and setup mocks for this test
      mockUseAtom.mockReset();
      mockUseAtomValue.mockReset();
      mockUseSetAtom.mockReset();

      mockUseAtom
        .mockReturnValueOnce([5, mockSetCounter])
        .mockReturnValueOnce([false, mockSetShowWelcome]) // showWelcome = false
        .mockReturnValueOnce([
          { notifications: true, autoRefresh: true, compactView: false },
          mockSetPreferences,
        ]);

      mockUseAtomValue.mockReturnValue(10);
      mockUseSetAtom.mockReturnValue(mockSetAsyncCounter);

      const { getByText } = renderWithProvider(<JotaiDemo />);

      expect(getByText("Welcome: Hidden")).toBeTruthy();
    });

    it("renders correctly when notifications are off", () => {
      // Reset and setup mocks for this test
      mockUseAtom.mockReset();
      mockUseAtomValue.mockReset();
      mockUseSetAtom.mockReset();

      mockUseAtom
        .mockReturnValueOnce([5, mockSetCounter])
        .mockReturnValueOnce([true, mockSetShowWelcome])
        .mockReturnValueOnce([
          { notifications: false, autoRefresh: false, compactView: true },
          mockSetPreferences,
        ]);

      mockUseAtomValue.mockReturnValue(10);
      mockUseSetAtom.mockReturnValue(mockSetAsyncCounter);

      const { getByText } = renderWithProvider(<JotaiDemo />);

      expect(getByText("Notifications: Off")).toBeTruthy();
      expect(getByText("Auto Refresh: Off | Compact View: On")).toBeTruthy();
    });

    it("renders with zero counter", () => {
      // Reset and setup mocks for this test
      mockUseAtom.mockReset();
      mockUseAtomValue.mockReset();
      mockUseSetAtom.mockReset();

      mockUseAtom
        .mockReturnValueOnce([0, mockSetCounter]) // counter = 0
        .mockReturnValueOnce([true, mockSetShowWelcome])
        .mockReturnValueOnce([
          { notifications: true, autoRefresh: true, compactView: false },
          mockSetPreferences,
        ]);

      mockUseAtomValue.mockReturnValue(0); // doubleCount = 0
      mockUseSetAtom.mockReturnValue(mockSetAsyncCounter);

      const { getByText } = renderWithProvider(<JotaiDemo />);

      expect(getByText("0")).toBeTruthy();
      expect(getByText("Double: 0")).toBeTruthy();
    });

    it("renders with negative counter", () => {
      // Reset and setup mocks for this test
      mockUseAtom.mockReset();
      mockUseAtomValue.mockReset();
      mockUseSetAtom.mockReset();

      mockUseAtom
        .mockReturnValueOnce([-3, mockSetCounter]) // counter = -3
        .mockReturnValueOnce([true, mockSetShowWelcome])
        .mockReturnValueOnce([
          { notifications: true, autoRefresh: true, compactView: false },
          mockSetPreferences,
        ]);

      mockUseAtomValue.mockReturnValue(-6); // doubleCount = -6
      mockUseSetAtom.mockReturnValue(mockSetAsyncCounter);

      const { getByText } = renderWithProvider(<JotaiDemo />);

      expect(getByText("-3")).toBeTruthy();
      expect(getByText("Double: -6")).toBeTruthy();
    });
  });
});
