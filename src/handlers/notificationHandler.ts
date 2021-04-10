import {
  store,
  notificationActions,
  persistentStore,
  persistentActions,
  NotificationModel,
} from 'fixit-common-data-store';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging/lib';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { DeviceInstallationUpsertRequest } from 'src/models/notifications/DeviceInstallationUpsertRequest';
import jwtDecode from 'jwt-decode';
import NotificationService from '../services/notificationService';
import config from '../config/appConfig';

export default class NotificationHandler {
  private static instance: NotificationHandler;

  private notificationService = new NotificationService(
    config.notificationApiUrl,
  );

  public static getInstance(): NotificationHandler {
    if (!NotificationHandler.instance) {
      NotificationHandler.instance = new NotificationHandler();
    }
    return NotificationHandler.instance;
  }

  private tokenIsOutdated = (token: string): boolean => {
    const state = persistentStore.getState();
    return token !== state.pushChannelToken;
  };

  displayNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    if (!this.notificationCanBeDisplayed(remoteMessage)) {
      console.warn('Notification cannot be displayed.');
      return;
    }
    store.dispatch(notificationActions.default.displayNotification(remoteMessage));
    const notificationModel : NotificationModel = {
      ...remoteMessage,
      requestSummary: remoteMessage.data,
      visited: false,
    };
    const { unseenNotificationsNumber } = persistentStore.getState();
    // type of notification needs to be array instead of notificationModelect of array
    const { notifications } = persistentStore.getState().notificationList;
    let isAlreadyInList = false;
    if (notifications) {
      notifications.forEach((notification:any) => {
        if (notification.messageId === notificationModel.messageId) {
          isAlreadyInList = true;
        }
      });

      if (!isAlreadyInList) {
        notifications.unshift(notificationModel);
      }
    }
    persistentStore.dispatch(persistentActions.default.setNotificationList(
      { notifications },
      isAlreadyInList ? unseenNotificationsNumber : unseenNotificationsNumber + 1,
    ));
  }

  async registerDevice() {
    const token: any = await messaging().getToken();
    const platform = Platform.OS === 'ios' ? 'apns' : 'fcm';
    const state = persistentStore.getState();
    if (this.tokenIsOutdated(token) && state.user.authToken) {
      const decodedAuthToken: {sub: string} = jwtDecode(state.user.authToken);
      const userId = decodedAuthToken.sub;

      const deviceInstallationUpsertRequest: DeviceInstallationUpsertRequest = {
        UserId: userId,
        InstallationId: DeviceInfo.getUniqueId(),
        Platform: platform,
        PushChannelToken: token,
        Tags: [{ key: 'userId', value: userId }],
        Templates: {},
      };

      this.notificationService
        .installDevice(deviceInstallationUpsertRequest)
        .then((_) => {
          persistentStore.dispatch(
            persistentActions.default.setPushChannelToken(token),
          );
        })
        .catch((err) => {
          console.error('There was an error installing the device.');
          console.error(err);
        });
    }
  }

  onForegroundNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    this.displayNotification(remoteMessage);
  }

  // When app is not opened
  onBackgroundNotification = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    // TODO: what to do when a notification appears in the bg
  };

  // When app is not opened, but click on notif banner
  // background -> background opened
  onBackgroundNotificationOpened(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) {
    // TODO: navigate to appropriate screen
    this.displayNotification(remoteMessage);
  }

  // When app is closed, open from background notif banner
  // background -> quit opened
  onQuitNotificationOpened(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    // TODO: navigate to appropriate screen
    this.displayNotification(remoteMessage);
  }

  private notificationCanBeDisplayed = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => remoteMessage
    && remoteMessage.messageId
    && remoteMessage.notification
    && remoteMessage.notification.title;
}
