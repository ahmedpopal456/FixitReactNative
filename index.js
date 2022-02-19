import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { AppRegistry, LogBox } from 'react-native';
import React from 'react';
import App from './src/App';
import { name as appName } from './app.json';
import NotificationHandlerService from './src/core/handlers/notificationHandlerService';
import Logger from './src/logger';
import './i18n';

const notificationService = new NotificationHandlerService();
notificationService.configure();

LogBox.ignoreLogs(['Require cycle: node_modules\\react-native\\Libraries\\Network\\fetch.js']);
Logger.instance.loadAppInsights();

const HeadlessCheck = ({ isHeadless }) => {
  if (isHeadless) {
    return null;
  }

  return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
