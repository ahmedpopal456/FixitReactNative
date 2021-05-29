import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';
import { name as appName } from './app.json';
import NotificationHandler from './src/core/handlers/notificationHandler';

const notificationSetup = NotificationHandler.getInstance();

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // TODO: Add BackgroundMessageHandler
});

const HeadlessCheck = ({ isHeadless }) => {
  if (isHeadless) {
    return null;
  }

  return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
