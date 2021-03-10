import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';
import {name as appName} from './app.json';
import NotificationHandler from './src/handlers/notificationHandler.ts';

const notificationHandler = NotificationHandler.getInstance();

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  notificationHandler.onBackgroundNotification(remoteMessage);
});

const HeadlessCheck = ({isHeadless}) => {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
