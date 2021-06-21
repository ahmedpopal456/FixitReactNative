import React from 'react';
import {
  connect,
  notificationActions,
  StoreState,
} from 'fixit-common-data-store';
import { NotificationProps } from '../../common/models/notifications/NotificationProps';
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

const mapStateToProps = (state: StoreState) => ({
  messages: state.notifications.messages,
});

const mapDispatchToProps = (dispatch: any) => ({
  onDismissNotification: (id: string) => {
    dispatch(notificationActions.dismissNotification({ messageId: id }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationRenderer);
