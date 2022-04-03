import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import jwtDecode from 'jwt-decode';
import config from '../config/appConfig';
import {
  DeviceInstallationUpsertRequestDto,
  NotificationDocument,
  NotificationPlatform,
  notificationsActions,
  NotificationsService,
  NotificationStatus,
  NotificationTypes,
  store,
} from '../../store';

const notificationService = new NotificationsService(config, store);

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
        const pnPlatform = this.state.registeredOS == 'ios' ? NotificationPlatform.APNS : NotificationPlatform.FCM;
        const pnToken = this.state.registeredToken;
        const state = store.getState();
        if (state.user.authToken) {
          const decodedAuthToken: { sub: string } = jwtDecode(state.user.authToken);
          const userId = decodedAuthToken.sub;
          const deviceInstallationUpsertRequest: DeviceInstallationUpsertRequestDto = {
            userId: userId,
            installationId: deviceId,
            platform: pnPlatform,
            pushChannelToken: pnToken,
            tags: [{ key: 'userId', value: userId }],
            templates: null,
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

  public async onNotificationReceived(remoteMessage: any) {
    if (remoteMessage && remoteMessage.data) {
      const notification = {
        id: remoteMessage.data.id,
        title: remoteMessage.title,
        message: remoteMessage.message,
        status: NotificationStatus.SEND,
        createdTimestampUtc: Math.round(Date.now() / 1000),
        payload: {
          action:
            typeof remoteMessage?.data?.action === 'string'
              ? JSON.parse(remoteMessage.data.action)
              : remoteMessage.data.action,
          systemPayload:
            typeof remoteMessage?.data?.systemPayload === 'string'
              ? JSON.parse(remoteMessage.data.systemPayload)
              : remoteMessage.data.systemPayload,
        },
      } as NotificationDocument;

      store.dispatch(notificationsActions.PUSH_NOTIFICATION(notification));
      store.dispatch(notificationsActions.DISPLAY_NOTIFICATION(notification));
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
