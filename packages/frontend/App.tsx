import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerMenuScreen from './screens/DrawerMenuScreen';

export default function App() {
  return (
    <NavigationContainer>
      <DrawerMenuScreen />
    </NavigationContainer>
  );
}
