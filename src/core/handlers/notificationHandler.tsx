import {
  notificationActions,
  store,
  persistentActions,
  NotificationModel,
} from 'fixit-common-data-store';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import jwtDecode from 'jwt-decode';
import { IAutoExceptionTelemetry } from '@microsoft/applicationinsights-web';
import { DeviceInstallationUpsertRequest } from '../../common/models/notifications/DeviceInstallationUpsertRequest';
import NotificationService from '../services/notification/notificationService';
import config from '../config/appConfig';
import Logger from '../../logger';

export default class NotificationHandler {
  private static instance: NotificationHandler;

  private notificationService = new NotificationService(
    config.notificationApiUrl,
  );

  constructor() {
    this.onBackgroundNotificationOpened();
    this.onForegroundNotification();
    this.onQuitNotificationOpened();
  }

  public static getInstance(): NotificationHandler {
    if (!NotificationHandler.instance) {
      NotificationHandler.instance = new NotificationHandler();
    }
    return NotificationHandler.instance;
  }

  public async registerDevice() : Promise<void> {
    const token: any = await messaging().getToken();
    const platform = Platform.OS === 'ios' ? 'apns' : 'fcm';
    const state = store.getState();
    if (this.isTokenOutdated(token) && state.user.authToken) {
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
          store.dispatch(
            persistentActions.default.setPushChannelToken(token),
          );
        })
        .catch((err) => {
          Logger.instance.trackException({
            error: new Error('There was an error installing the device.'),
            exception: {
              error: err,
            } as IAutoExceptionTelemetry,
          });
        });
    }
  }

  public displayNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage) : void {
    if (!this.notificationCanBeDisplayed(remoteMessage)) {
      return;
    }
    store.dispatch(notificationActions.displayNotification({ messages: [remoteMessage] }));
    const notificationModel : NotificationModel = {
      ...remoteMessage,
      requestSummary: remoteMessage,
      visited: false,
    };
    const { unseenNotificationsNumber } = store.getState().persist;
    const { notifications } = store.getState().persist.notificationList;

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
    store.dispatch(persistentActions.default.setNotificationList(
      { notifications },
      isAlreadyInList ? unseenNotificationsNumber : unseenNotificationsNumber + 1,
    ));
  }

  onForegroundNotification() : void {
    messaging().onMessage(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        this.displayNotification(remoteMessage);
      },
    );
  }

  onBackgroundNotificationOpened() : void {
    messaging().onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      this.displayNotification(remoteMessage);
    });
  }

  onQuitNotificationOpened() : void {
    messaging().getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          this.displayNotification(remoteMessage);
        }
      })
      .catch((err) => {
        Logger.instance.trackException({
          exception: {
            error: err,
          } as IAutoExceptionTelemetry,
        });
      });
  }

  private isTokenOutdated = (token: string): boolean => {
    const state = store.getState();
    return token !== state.persist.pushChannelToken;
  };

  public requestUserPermission = async (): Promise<boolean> => {
    const authStatus = await messaging().requestPermission();
    const enabled: boolean = authStatus === messaging.AuthorizationStatus.AUTHORIZED
      || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }

  private notificationCanBeDisplayed = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => remoteMessage
    && remoteMessage.messageId
    && remoteMessage.notification
    && remoteMessage.notification.title;
}
