import { Pressable, Text, View } from "react-native";

import {
  asyncCounterAtom,
  counterAtom,
  doubleCountAtom,
  showWelcomeAtom,
  useAtom,
  useAtomValue,
  userPreferencesAtom,
  useSetAtom,
} from "@/store";

export function JotaiDemo() {
  const [counter, setCounter] = useAtom(counterAtom);
  const doubleCount = useAtomValue(doubleCountAtom);
  const setAsyncCounter = useSetAtom(asyncCounterAtom);
  const [showWelcome, setShowWelcome] = useAtom(showWelcomeAtom);
  const [preferences, setPreferences] = useAtom(userPreferencesAtom);

  const handleAsyncIncrement = async () => {
    await setAsyncCounter(prev => prev + 1);
  };

  const toggleNotifications = () => {
    setPreferences(prev => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  };

  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Jotai State Demo
      </Text>

      {/* Counter Demo */}
      <View className="mb-4">
        <Text className="text-sm text-gray-600 mb-2">Counter State:</Text>
        <View className="flex-row items-center gap-3">
          <Pressable
            className="bg-blue-500 px-3 py-2 rounded-md active:bg-blue-600"
            onPress={() => setCounter(prev => prev - 1)}
          >
            <Text className="text-white font-medium">-</Text>
          </Pressable>

          <Text className="text-lg font-mono min-w-8 text-center">
            {counter}
          </Text>

          <Pressable
            className="bg-blue-500 px-3 py-2 rounded-md active:bg-blue-600"
            onPress={() => setCounter(prev => prev + 1)}
          >
            <Text className="text-white font-medium">+</Text>
          </Pressable>
        </View>

        <Text className="text-xs text-gray-500 mt-1">
          Double:
          {" "}
          {doubleCount}
        </Text>
      </View>

      {/* Async Counter Demo */}
      <View className="mb-4">
        <Text className="text-sm text-gray-600 mb-2">Async Counter:</Text>
        <Pressable
          className="bg-green-500 px-4 py-2 rounded-md active:bg-green-600"
          onPress={handleAsyncIncrement}
        >
          <Text className="text-white font-medium text-center">
            Async +1
          </Text>
        </Pressable>
      </View>

      {/* UI State Demo */}
      <View className="mb-4">
        <Text className="text-sm text-gray-600 mb-2">UI State:</Text>
        <Pressable
          className={`px-4 py-2 rounded-md ${
            showWelcome ? "bg-yellow-500 active:bg-yellow-600" : "bg-gray-500 active:bg-gray-600"
          }`}
          onPress={() => setShowWelcome(!showWelcome)}
        >
          <Text className="text-white font-medium text-center">
            Welcome:
            {" "}
            {showWelcome ? "Shown" : "Hidden"}
          </Text>
        </Pressable>
      </View>

      {/* Preferences Demo */}
      <View>
        <Text className="text-sm text-gray-600 mb-2">Preferences:</Text>
        <Pressable
          className={`px-4 py-2 rounded-md ${
            preferences.notifications ? "bg-purple-500 active:bg-purple-600" : "bg-gray-500 active:bg-gray-600"
          }`}
          onPress={toggleNotifications}
        >
          <Text className="text-white font-medium text-center">
            Notifications:
            {" "}
            {preferences.notifications ? "On" : "Off"}
          </Text>
        </Pressable>

        <Text className="text-xs text-gray-500 mt-2">
          Auto Refresh:
          {" "}
          {preferences.autoRefresh ? "On" : "Off"}
          {" "}
          |
          Compact View:
          {" "}
          {preferences.compactView ? "On" : "Off"}
        </Text>
      </View>
    </View>
  );
}
