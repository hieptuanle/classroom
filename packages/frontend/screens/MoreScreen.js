import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MoreScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>This is the More Screen!</Text>
      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
