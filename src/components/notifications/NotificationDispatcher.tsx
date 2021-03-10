import React from 'react';
import {
  connect,
  rootContext,
  notificationActions
} from 'fixit-common-data-store';
import NotificationFactory from '../../factories/notificationFactory';
import {NotificationProps} from '../../models/notifications/NotificationProps';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

class NotificationDispatcher extends React.Component<any> {

  render() {
    return <NotificationFactory {...this._buildChildProps()} />;
  }

  private _buildChildProps(): NotificationProps {
    const message = this.props.messages[this.props.messages?.length - 1];
    const notificationType = +message?.data?.type;

    return {
      message: message,
      type: notificationType,
      onDismissNotification: this.props.onDismissNotification,
    };
  }
}

const mapStateToProps = (state: {notifications: {messages: FirebaseMessagingTypes.RemoteMessage[]}}) => {
  return {
    messages: state.notifications.messages,
  };
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    onDismissNotification: (id: string) => {
      dispatch(notificationActions.default.dismissNotification(id));
    },
  };
};

//@ts-ignore
export default connect(mapStateToProps, mapDispatchToProps, null, {
  context: rootContext,
})(NotificationDispatcher);
