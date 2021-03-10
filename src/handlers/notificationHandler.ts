import {
  store,
  notificationActions,
  persistentStore,
  persistentActions
} from 'fixit-common-data-store';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging/lib';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {DeviceInstallationUpsertRequest} from 'src/models/notifications/DeviceInstallationUpsertRequest';
import jwt_decode from 'jwt-decode';
import NotificationService from '../services/notificationService';
import {config} from '../config/appConfig';

export default class NotificationHandler {
  private static instance: NotificationHandler;
  private _notificationService = new NotificationService(
    config.notificationApiUrl,
  );

  private constructor() {}

  public static getInstance(): NotificationHandler {
    if (!NotificationHandler.instance) {
      NotificationHandler.instance = new NotificationHandler();
    }
    return NotificationHandler.instance;
  }

  private _tokenIsOutdated(token: string): boolean {
    const state = persistentStore.getState();
    return token != state.pushChannelToken;
  }

  displayNotification(message: FirebaseMessagingTypes.RemoteMessage) {
    if (!this._notificationCanBeDisplayed(message)) {
      throw 'Notification cannot be displayed.'
    }
    store.dispatch(notificationActions.default.displayNotification(message));
  }

  async registerDevice() {
    const token: any = await messaging().getToken();
    const platform = Platform.OS === 'ios' ? 'apns' : 'fcm';
    const state = persistentStore.getState();
    if (this._tokenIsOutdated(token) && state.user.authToken) {
      const decodedAuthToken: {sub: string} = jwt_decode(state.user.authToken);
      const userId = decodedAuthToken.sub;

      const deviceInstallationUpsertRequest: DeviceInstallationUpsertRequest = {
        UserId: userId,
        InstallationId: DeviceInfo.getUniqueId(),
        Platform: platform,
        PushChannelToken: token,
        Tags: [{key: 'default', value: 'user'}],
        Templates: {},
      };

      this._notificationService
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

  onForegroundNotification(message: FirebaseMessagingTypes.RemoteMessage) {
    this.displayNotification(message);
  }

  onBackgroundNotification(message: FirebaseMessagingTypes.RemoteMessage) {
    // TODO: what to do when a notification appears in the bg
  }

  onBackgroundNotificationOpened(
    message: FirebaseMessagingTypes.RemoteMessage,
  ) {
    // TODO: navigate to appropriate screen
    this.displayNotification(message);
  }

  onQuitNotificationOpened(message: FirebaseMessagingTypes.RemoteMessage) {
    // TODO: navigate to appropriate screen
    this.displayNotification(message);
  }

  private _notificationCanBeDisplayed(
    message: FirebaseMessagingTypes.RemoteMessage,
  ) {
    return (
      message &&
      message.messageId &&
      message.notification &&
      message.notification.title
    );
  }
}
