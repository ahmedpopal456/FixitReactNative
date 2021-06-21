import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';
import { name as appName } from './app.json';
import NotificationHandler from './src/core/handlers/notificationHandler';
import Logger from './src/logger';

NotificationHandler.getInstance();
LogBox.ignoreLogs(['Require cycle: node_modules\\react-native\\Libraries\\Network\\fetch.js']);
Logger.instance.loadAppInsights();

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
