import PushNotification from 'react-native-push-notification';
import { store } from 'fixit-common-data-store';
import DeviceInfo from 'react-native-device-info';
import jwtDecode from 'jwt-decode';
import { DeviceInstallationUpsertRequest } from '../../common/models/notifications/DeviceInstallationUpsertRequest';
import NotificationService from '../services/notification/notificationService';
import config from '../config/appConfig';
import { PushNotificationIOS } from 'react-native';

export default class NotificationHandlerService {
  state: any;
  deviceId: string;

  public notificationService = new NotificationService(config.rawConfig.notificationApiUrl);
  private static instance: NotificationHandlerService;

  public static getInstance(): NotificationHandlerService {
    if (!NotificationHandlerService.instance) {
      NotificationHandlerService.instance = new NotificationHandlerService();
    }
    return NotificationHandlerService.instance;
  }

  constructor() {
    this.deviceId = DeviceInfo.getUniqueId();
    this.state = {
      status: 'Push notifications registration status is unknown',
      registeredOS: '',
      registeredToken: '',
      isRegistered: false,
      isBusy: false,
    };
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

  public onTokenReceived(token: any) {
    console.log(`Received a notification token on ${token.os}`);
    this.state = {
      registeredToken: token.token,
      registeredOS: token.os,
      status: `The push notifications token has been received.`,
    };

    if (this.state.isRegistered && this.state.registeredToken && this.state.registeredOS) {
      this.register();
    }
  }

  public async register() {
    let status: string = 'Registering...';
    let isRegistered = this.state.isRegistered;
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
          InstallationId: DeviceInfo.getUniqueId(),
          Platform: pnPlatform,
          PushChannelToken: pnToken,
          Tags: [{ key: 'userId', value: userId }],
          Templates: {},
        };
        const response = await this.notificationService.installDevice(deviceInstallationUpsertRequest);
        status = `Registered for ${this.state.registeredOS} push notifications`;
        isRegistered = true;
      }
    } catch (e) {
      status = `Registration failed: ${e}`;
    } finally {
      this.state = { ...this.state, isBusy: false, status, isRegistered };
    }
  }

  public onNotificationReceived(notification: any) {
    console.log(`Received a push notification on ${this.state.registeredOS}`);
    this.state = { ...this.state, status: `Received a push notification...` };
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
