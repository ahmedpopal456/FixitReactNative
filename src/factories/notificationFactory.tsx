import React from 'react';
import {NotificationAction} from '../components/notifications/notificationActionsEnum';
import {
  FixClientRequestNotification,
  FixCraftsmanResponseNotification,
} from '../components/notifications';
import {NotificationProps} from '../models/notifications/NotificationProps';

// TODO: Implement all the Notification Components
// this is just an example demonstrating the possiblility of various
// notification types
const NotificationFactory = (props: NotificationProps) => {
  switch (props.type) {
    case NotificationAction.FIX_CLIENT_REQUEST:
      return <FixClientRequestNotification {...props} />;
    case NotificationAction.FIX_CRAFTSMAN_RESPONSE:
      return <FixCraftsmanResponseNotification {...props} />;
    default:
      return <FixClientRequestNotification {...props} />;
  }
};

export default NotificationFactory;
