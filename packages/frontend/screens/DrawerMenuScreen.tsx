import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import ClassListScreen from './ClassListScreen';
import NotificationsScreen from './NotificationsScreen';
import SettingsScreen from './SettingsScreen';
import TodoListScreen from './TodoListScreen';

const Drawer = createDrawerNavigator();
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Google Classroom</Text>
      </View>


      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}


export default function DrawerMenu() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      
    >
      <Drawer.Screen name="ClassList" component={ClassListScreen} options={{ title: 'Danh sách lớp' }} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Thông báo' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Cài đặt' }} />
      <Drawer.Screen name="TodoList" component={TodoListScreen} options={{ title: 'Việc cần làm' }} />
      
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    marginTop: 4,
  },
});
