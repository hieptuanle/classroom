import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Sample data (will be replaced with API or props later)
const teachClass = [
  { id: "t1", name: "Toán nâng cao 1", teacher: "Cô Mai", memberCount: 25, part: "Phần 1: Đại số" },
  { id: "t2", name: "Lý thuyết Đa thức", teacher: "Thầy An", memberCount: 30, part: "Phần 2: Đa thức" },
];

const joinClass = [
  { id: "j1", name: "Văn học hiện đại", teacher: "Thầy Nam", memberCount: 28, part: "Phần 1: Thơ mới" },
  { id: "j2", name: "Lịch sử thế giới", teacher: "Cô Hương", memberCount: 32, part: "Phần 3: Chiến tranh thế giới" },
  { id: "j3", name: "Tiếng Anh giao tiếp", teacher: "Cô Lan", memberCount: 20, part: "Phần 2: Hội thoại thực tế" },
];

type ClassItem = {
  id: string;
  name: string;
  teacher: string;
  memberCount: number;
  part: string;
};

export default function ClassListScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [floatingModalVisible, setFloatingModalVisible] = useState(false);

  const handlePress = (classItem: ClassItem) => {
    router.push({
      pathname: "/class/[id]",
      params: {
        id: classItem.id,
        name: classItem.name,
      },
    });
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView className="p-4">
        {/* Classes you teach */}
        <Text className="text-xl font-bold mt-5 mb-2 text-gray-800 dark:text-white">Lớp bạn dạy</Text>
        {teachClass.map(item => (
          <TouchableOpacity
            key={item.id}
            className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg mb-3"
            onPress={() => handlePress(item)}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-black dark:text-white uppercase">{item.name}</Text>
                <Text className="text-blue-600 dark:text-blue-400 mt-1 mb-1 font-medium">{item.part}</Text>
                <Text className="text-gray-600 dark:text-gray-300 text-sm">
                  {item.memberCount}
                  {" "}
                  học viên
                </Text>
              </View>
              <Pressable onPress={() => setModalVisible(true)} className="p-2">
                <Text className="text-2xl text-gray-500 dark:text-gray-400">⋮</Text>
              </Pressable>
            </View>
          </TouchableOpacity>
        ))}

        {/* Classes you joined */}
        <Text className="text-xl font-bold mt-5 mb-2 text-gray-800 dark:text-white">Lớp bạn tham gia</Text>
        {joinClass.map(item => (
          <TouchableOpacity
            key={item.id}
            className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg mb-3"
            onPress={() => handlePress(item)}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-black dark:text-white uppercase">{item.name}</Text>
                <Text className="text-blue-600 dark:text-blue-400 mt-1 mb-1 font-medium">{item.part}</Text>
                <Text className="text-gray-600 dark:text-gray-300 text-sm">{item.teacher}</Text>
              </View>
              <Pressable onPress={() => setModalVisible(true)} className="p-2">
                <Text className="text-2xl text-gray-500 dark:text-gray-400">⋮</Text>
              </Pressable>
            </View>
          </TouchableOpacity>
        ))}

        {/* Modal for dots button */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 bg-black/30 justify-center items-center">
            <View className="bg-white dark:bg-gray-800 p-6 rounded-lg min-w-[200px]">
              <Text className="text-lg mb-4 text-black dark:text-white">Tùy chọn lớp học</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text className="text-base text-blue-600 dark:text-blue-400">Đóng</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        className="absolute right-6 bottom-8 bg-blue-600 dark:bg-blue-500 rounded-full w-14 h-14 flex-row items-center justify-center shadow-lg"
        onPress={() => setFloatingModalVisible(true)}
      >
        <Text className="text-white text-3xl">+</Text>
      </Pressable>

      {/* Modal for floating button */}
      <Modal
        visible={floatingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFloatingModalVisible(false)}
      >
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="bg-white dark:bg-gray-800 p-6 rounded-lg min-w-[200px]">
            <Text className="text-lg mb-4 text-black dark:text-white">Thêm lớp học mới</Text>
            <Pressable onPress={() => setFloatingModalVisible(false)}>
              <Text className="text-base text-blue-600 dark:text-blue-400">Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
