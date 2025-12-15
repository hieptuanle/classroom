import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
            width: 280,
          },
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#1976d2",
          },
          headerTintColor: colorScheme === "dark" ? "#fff" : "#fff",
          drawerActiveTintColor: colorScheme === "dark" ? "#fff" : "#1976d2",
          drawerInactiveTintColor: colorScheme === "dark" ? "#999" : "#666",
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerType: "front",
            drawerLabel: "Danh sách lớp",
            title: "Google Classroom",
          }}
        />
        <Drawer.Screen
          name="notifications"
          options={{
            drawerType: "front",
            drawerLabel: "Thông báo",
            title: "Thông báo",
          }}
        />
        <Drawer.Screen
          name="todo-list"
          options={{
            drawerType: "front",
            drawerLabel: "Việc cần làm",
            title: "Việc cần làm",
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerType: "front",
            drawerLabel: "Cài đặt",
            title: "Cài đặt",
          }}
        />
        <Drawer.Screen
          name="demo"
          options={{
            drawerType: "front",
            drawerLabel: "Demo",
            title: "Demo",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
