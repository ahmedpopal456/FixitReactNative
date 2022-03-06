import React, { FunctionComponent, useEffect } from 'react';
import { StoreState, useSelector } from 'fixit-common-data-store';
import { NotificationProps } from '../../common/models/notifications/NotificationProps';
import { FixNotifications } from '.';

export const NotificationRenderer: FunctionComponent<NotificationProps> = (props: NotificationProps): JSX.Element => {
  const currentDisplayedRemoteMessage = useSelector(
    (storeState: StoreState) => storeState.notifications.currentDisplayedRemoteMessage,
  );

  useEffect(() => {}, [currentDisplayedRemoteMessage]);

  const render = (): JSX.Element => {
    console.log(currentDisplayedRemoteMessage);
    if (currentDisplayedRemoteMessage) {
      return FixNotifications({
        currentDisplayedRemoteMessageData: currentDisplayedRemoteMessage,
        navRef: props.navRef,
      }) as JSX.Element;
    }
    return <></>;
  };
  return render();
};
