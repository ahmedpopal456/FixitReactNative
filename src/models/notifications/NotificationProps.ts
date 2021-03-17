import { FirebaseMessagingTypes } from '@react-native-firebase/messaging/lib';

export type NotificationProps = {
  message: FirebaseMessagingTypes.RemoteMessage;
  type: number | undefined;
  onDismissNotification: Function;
};
