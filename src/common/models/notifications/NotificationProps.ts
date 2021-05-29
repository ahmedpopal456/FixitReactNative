import { FirebaseMessagingTypes } from '@react-native-firebase/messaging/lib';

export type NotificationProps = {
  message: FirebaseMessagingTypes.RemoteMessage;
  type: number | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onDismissNotification: Function | any;
  navRef?: any;
};
