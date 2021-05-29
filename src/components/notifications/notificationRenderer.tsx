import React from 'react';
import {
  connect,
  rootContext,
  notificationActions,
} from 'fixit-common-data-store';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { NotificationProps } from '../../common/models/notifications/notificationProps';
import {
  FixClientRequest,
  FixCraftsmanResponse,
} from '.';

class NotificationRenderer extends React.Component<any> {
  render() {
    const props = this.buildChildProps();
    if (props.message && props.message.data) {
      switch (props.message.data.action) {
        case 'FixCraftsmanResponse':
          return <FixCraftsmanResponse {...props} />;
        case 'FixClientRequest':
          return <FixClientRequest {...props} />;
        default:
      }
    }
    return <></>;
  }

  private buildChildProps(): NotificationProps {
    const message = this.props.messages[this.props.messages?.length - 1];
    const notificationType = +message?.data?.type;
    return {
      message,
      type: notificationType,
      onDismissNotification: this.props.onDismissNotification,
      navRef: this.props.navRef,
    };
  }
}

const mapStateToProps = (state: {
  notifications: {messages: FirebaseMessagingTypes.RemoteMessage[]}
}) => ({
  messages: state.notifications.messages,
});

const mapDispatchToProps = (dispatch) => ({
  onDismissNotification: (id: string) => {
    dispatch(notificationActions.default.dismissNotification(id));
  },
});

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps, null, {
  context: rootContext,
})(NotificationRenderer);
