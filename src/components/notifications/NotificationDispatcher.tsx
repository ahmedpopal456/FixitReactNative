import React from 'react';
import {
  connect,
  rootContext,
  notificationActions,
} from 'fixit-common-data-store';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import NotificationFactory from '../../factories/notificationFactory';
import { NotificationProps } from '../../models/notifications/NotificationProps';

class NotificationDispatcher extends React.Component<any> {
  render() {
    return <NotificationFactory {...this.buildChildProps()} />;
  }

  private buildChildProps(): NotificationProps {
    const message = this.props.messages[this.props.messages?.length - 1];
    const notificationType = +message?.data?.type;

    return {
      message,
      type: notificationType,
      onDismissNotification: this.props.onDismissNotification,
    };
  }
}

const mapStateToProps = (state: {
  notifications: {messages: FirebaseMessagingTypes.RemoteMessage[]}
}) => ({
  messages: state.notifications.messages,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onDismissNotification: (id: string) => {
    dispatch(notificationActions.default.dismissNotification(id));
  },
});

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps, null, {
  context: rootContext,
})(NotificationDispatcher);
