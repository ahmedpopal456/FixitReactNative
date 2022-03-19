import React, { FunctionComponent, useEffect } from 'react';
import { NotificationTypes, StoreState, useSelector } from '../../store';
import { NotificationProps } from '../../common/models/notifications/NotificationProps';
import FixNotification from './fixrequests/fixNotification';

export const NotificationRenderer: FunctionComponent<NotificationProps> = (props: NotificationProps): JSX.Element => {
  const currentDisplayedNotificationPayload = useSelector(
    (storeState: StoreState) => storeState.notifications.currentDisplayedNotificationPayload,
  );

  useEffect(() => {}, [currentDisplayedNotificationPayload]);

  const render = (): JSX.Element => {
    if (currentDisplayedNotificationPayload) {
      const notificationProps = {
        currentDisplayedRemoteMessageData: currentDisplayedNotificationPayload,
        navRef: props.navRef,
      };

      switch (currentDisplayedNotificationPayload.payload?.action) {
        case NotificationTypes.FixClientRequest:
        case NotificationTypes.FixCraftsmanResponse:
          return <FixNotification {...notificationProps}></FixNotification>;
        default:
          break;
      }
    }
    return <></>;
  };
  return render();
};
