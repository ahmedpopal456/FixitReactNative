import React from 'react';
import { connect, notificationActions, StoreState } from 'fixit-common-data-store';
import { NotificationProps } from '../../common/models/notifications/NotificationProps';
import { FixNotifications } from '.';

class NotificationRenderer extends React.Component<any> {
  render() {
    const props = this.buildChildProps();
    if (props.message && props.message.data) {
      return <FixNotifications {...props} />;
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
  messages: state.remoteMessages.messages,
});

const mapDispatchToProps = (dispatch: any) => ({
  onDismissNotification: (id: string) => {
    dispatch(notificationActions.dismissNotification({ messageId: id }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationRenderer);
