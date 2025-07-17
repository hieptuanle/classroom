import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#fff",
            width: 280,
          },
          headerStyle: {
            backgroundColor: "#1976d2",
          },
          headerTintColor: "#fff",
          drawerActiveTintColor: "#1976d2",
          drawerInactiveTintColor: "#666",
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
