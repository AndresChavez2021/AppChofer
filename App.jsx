import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './src/Providers/AuthProviders';
import { RootSiblingParent } from "react-native-root-siblings";
import * as Notifications from 'expo-notifications';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

Notifications.setNotificationHandler({
  handleNotification:async ()=>({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
})
export default function App() {
  return (
    <RootSiblingParent>
    <AuthProvider />
  </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
