import React from 'react';
import {
  FixClientRequest,
  FixCraftsmanResponse,
} from '../components/notifications';
import { NotificationProps } from '../models/notifications/NotificationProps';

// TODO: Implement all the Notification Components
// this is just an example demonstrating the possiblility of various
// notification types
const NotificationFactory = (props: NotificationProps) : JSX.Element => {
  if (props.message && props.message.data) {
    switch (props.message.data.action) {
      case 'FixCraftsmanResponse':
        return <FixCraftsmanResponse {...props} />;
      case 'FixClientRequest':
        return <FixClientRequest {...props} />;
      default:
        return <></>;
    }
  }
  return <></>;
};

export default NotificationFactory;
