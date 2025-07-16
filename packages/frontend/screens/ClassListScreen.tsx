import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, Pressable } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

// Dữ liệu mẫu (sau này sẽ thay bằng API hoặc props)
const teachClass = [
  { id: 't1', name: 'Toán nâng cao 1', teacher: 'Cô Mai', memberCount: 25, part: 'Phần 1: Đại số' },
  { id: 't2', name: 'Lý thuyết Đa thức', teacher: 'Thầy An', memberCount: 30, part: 'Phần 2: Đa thức' },
];

const joinClass = [
  { id: 'j1', name: 'Văn học hiện đại', teacher: 'Thầy Nam', memberCount: 28, part: 'Phần 1: Thơ mới' },
  { id: 'j2', name: 'Lịch sử thế giới', teacher: 'Cô Hương', memberCount: 32, part: 'Phần 3: Chiến tranh thế giới' },
  { id: 'j3', name: 'Tiếng Anh giao tiếp', teacher: 'Cô Lan', memberCount: 20, part: 'Phần 2: Hội thoại thực tế' },
];

type ClassItem = {
  id: string;
  name: string;
  teacher: string;
  memberCount: number;
  part: string;
};

type Props = {
  navigation: NavigationProp<any>;
};

const ClassListScreen = ({ navigation }: Props) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [floatingModalVisible, setFloatingModalVisible] = React.useState(false);
  const handlePress = (classItem: ClassItem) => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('ClassDetail', {
        classId: classItem.id,
        className: classItem.name,
      });
    } else {
      // Nếu không có navigation, báo lỗi rõ ràng
      Alert.alert('Lỗi', 'Không tìm thấy navigation. Hãy đảm bảo component này được sử dụng trong navigator.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Danh sách lớp bạn dạy */}
        <Text style={styles.sectionTitle}>Lớp bạn dạy</Text>
        {teachClass.map((item) => (
          <TouchableOpacity key={item.id} style={styles.classItem} onPress={() => handlePress(item)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.className}>{item.name.toUpperCase()}</Text>
                <Text style={styles.part}>{item.part}</Text>
                <Text style={styles.memberCount}>{item.memberCount} học viên</Text>
              </View>
              <Pressable onPress={() => setModalVisible(true)} style={styles.dotsButton}>
                <Text style={styles.dotsIcon}>{'⋮'}</Text>
              </Pressable>
            </View>
          </TouchableOpacity>
        ))}

        {/* Danh sách lớp bạn tham gia */}
        <Text style={styles.sectionTitle}>Lớp bạn tham gia</Text>
        {joinClass.map((item) => (
          <TouchableOpacity key={item.id} style={styles.classItem} onPress={() => handlePress(item)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.className}>{item.name.toUpperCase()}</Text>
                <Text style={styles.part}>{item.part}</Text>
                <Text style={styles.memberCount}>{item.teacher}</Text>
              </View>
              <Pressable onPress={() => setModalVisible(true)} style={styles.dotsButton}>
                <Text style={styles.dotsIcon}>{'⋮'}</Text>
              </Pressable>
            </View>
          </TouchableOpacity>
        ))}

        {/* Modal hiển thị khi bấm vào nút dots */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, minWidth: 200 }}>
              <Text style={{ fontSize: 18, marginBottom: 16 }}>Tùy chọn lớp học</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#1976d2', fontSize: 16 }}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {/* Floating Button ở góc dưới bên trái */}
      <Pressable
        style={styles.fab}
        onPress={() => setFloatingModalVisible(true)}
      >
        <Text style={styles.fabIcon}>{'+'}</Text>
      </Pressable>
      {/* Modal cho floating button */}
      <Modal
        visible={floatingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFloatingModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, minWidth: 200 }}>
            <Text style={{ fontSize: 18, marginBottom: 16 }}>Thêm lớp học mới</Text>
            <Pressable onPress={() => setFloatingModalVisible(false)}>
              <Text style={{ color: '#1976d2', fontSize: 16 }}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  classItem: {
    backgroundColor: '#e6f3ff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textTransform: 'uppercase',
  },
  teacherName: {
    fontSize: 14,
    color: '#555',
  },
  memberCount: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  part: {
    fontSize: 15,
    color: '#1976d2',
    marginTop: 2,
    marginBottom: 2,
    fontWeight: '500',
  },
  dotsButton: {
    padding: 8,
  },
  dotsIcon: {
    fontSize: 22,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#1976d2',
    borderRadius: 32,
    width: 56,
    height: 56,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#fff',
    fontSize: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 40,
  },
});

export default ClassListScreen;
