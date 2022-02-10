import { ReceivedNotification } from 'react-native-push-notification';

export type NotificationProps = {
  message: ReceivedNotification;
  type: number | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onDismissNotification: Function | any;
  navRef?: any;
};
