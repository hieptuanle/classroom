import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HelloWorldScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Button title="Click me" onPress={() => alert('You clicked me!')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',     // Căn giữa ngang
    justifyContent: 'center', // Căn giữa dọc
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#333',
    marginBottom: 20,         // Khoảng cách với Button
    fontWeight: 'bold',
  },
});
