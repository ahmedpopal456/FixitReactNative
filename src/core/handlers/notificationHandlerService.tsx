import PushNotification from 'react-native-push-notification';
import { FixesModel, notificationActions, persistentActions, store } from 'fixit-common-data-store';
import DeviceInfo from 'react-native-device-info';
import jwtDecode from 'jwt-decode';
import { DeviceInstallationUpsertRequest } from '../../common/models/notifications/DeviceInstallationUpsertRequest';
import NotificationService from '../services/notification/notificationService';
import config from '../config/appConfig';
import { v4 as uuidv4 } from 'uuid';

const notificationService = new NotificationService(config.rawConfig.notificationApiUrl);

export default class NotificationHandlerService {
  private state: any;
  private static instance: NotificationHandlerService;

  constructor() {
    this.state = {
      registeredOS: '',
      registeredToken: '',
      isRegistered: false,
      isBusy: false,
    };
  }

  public static getInstance(): NotificationHandlerService {
    if (!NotificationHandlerService.instance) {
      NotificationHandlerService.instance = new NotificationHandlerService();
    }
    return NotificationHandlerService.instance;
  }

  public configure() {
    PushNotification.requestPermissions();
    PushNotification.configure({
      onRegister: this.onTokenReceived,
      onNotification: this.onNotificationReceived,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    PushNotification.getApplicationIconBadgeNumber(function (number: number) {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  }

  public async onTokenReceived(token: any) {
    const deviceId = DeviceInfo.getUniqueId();
    this.state = {
      registeredToken: token.token,
      registeredOS: token.os,
      status: `The push notifications token has been received.`,
    };

    let status: string = 'Registering...';
    let isRegistered = this.state.isRegistered;
    if (!isRegistered) {
      try {
        this.state = { ...this.state, isBusy: true, status };
        const pnPlatform = this.state.registeredOS == 'ios' ? 'apns' : 'fcm';
        const pnToken = this.state.registeredToken;
        const state = store.getState();
        if (state.user.authToken) {
          const decodedAuthToken: { sub: string } = jwtDecode(state.user.authToken);
          const userId = decodedAuthToken.sub;
          const deviceInstallationUpsertRequest: DeviceInstallationUpsertRequest = {
            UserId: userId,
            InstallationId: deviceId,
            Platform: pnPlatform,
            PushChannelToken: pnToken,
            Tags: [{ key: 'userId', value: userId }],
            Templates: {},
          };
          await notificationService.installDevice(deviceInstallationUpsertRequest);
          status = `Registered for ${this.state.registeredOS} push notifications`;
          isRegistered = true;
        }
      } catch (e) {
        status = `Registration failed: ${e}`;
      } finally {
        this.state = { ...this.state, isBusy: false, status, isRegistered };
      }
    }
  }

  public onNotificationReceived(remoteMessage: any) {
    const { unseenNotificationsNumber, notifications } = store.getState().persist;
    if (!remoteMessage.id) {
      remoteMessage.id = uuidv4();
    }

    if (remoteMessage && remoteMessage.id) {
      notifications.unshift({
        remoteMessage,
        fix: remoteMessage.data.fixitdata as FixesModel,
        visited: false,
      });
      store.dispatch(persistentActions.default.setNotifications(notifications, unseenNotificationsNumber + 1));
      store.dispatch(notificationActions.displayNotification({ messages: [remoteMessage] }));
    }
  }

  public checkPermissions(cbk: any) {
    return PushNotification.checkPermissions(cbk);
  }

  public requestPermissions() {
    return PushNotification.requestPermissions();
  }

  public cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  public abandonPermissions() {
    PushNotification.abandonPermissions();
  }
}
