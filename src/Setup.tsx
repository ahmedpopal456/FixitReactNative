import React from 'react';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import NotificationHandler from './handlers/notificationHandler';

import BottomBarNavigator from './navigators/bottomBarNavigator';

class NotificationSetup extends React.Component<{user: any}> {
  notificationHandler: NotificationHandler = NotificationHandler.getInstance();

  componentDidMount() {
    this.setupCloudMessaging();
  }

  async setupCloudMessaging() {
    const notificationsEnabled = await this.requestUserPermission();
    if (notificationsEnabled) {
      await this.notificationHandler.registerDevice();
      this.setupCloudMessageHandlers();
    }
  }

  requestUserPermission = async (): Promise<boolean> => {
    const authStatus = await messaging().requestPermission();
    const enabled: boolean = authStatus === messaging.AuthorizationStatus.AUTHORIZED
      || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }

  setupCloudMessageHandlers() {
    // When Fixit is opened from a bg state by tapping on the notification banner
    messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        this.notificationHandler.onBackgroundNotificationOpened(remoteMessage);
      },
    );

    // When Fixit is opened from a quit state by tapping on the notification banner.
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          this.notificationHandler.onQuitNotificationOpened(remoteMessage);
        }
      })
      .catch((err) => console.log(err));
    // When Fixit is opened in the foreground
    messaging().onMessage(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        this.notificationHandler.onForegroundNotification(remoteMessage);
      },
    );
  }

  render = () => <BottomBarNavigator />
}

export default NotificationSetup;
