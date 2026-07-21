import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ToastNotificationProvider } from 'react-native-toast-notifications';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <ToastNotificationProvider>
      <View style={styles.container}>
        <RootNavigator />
      </View>
    </ToastNotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  }
});
