import React, { FunctionComponent, useState } from 'react';
import { FixesService, NotificationDocument, NotificationTypes, store, StoreState, useSelector } from '../../store';
import { NotificationProps } from '../../common/models/notifications/NotificationProps';
import config from '../../core/config/appConfig';
import useAsyncEffect from 'use-async-effect';
import FixNotification from './fixrequests/fixNotification';
import NavigationEnum from '../../common/enums/navigationEnum';
import { NavigationActions } from 'react-navigation';

const fixesService = new FixesService(config, store);
export const NotificationRenderer: FunctionComponent<NotificationProps> = (props: NotificationProps): JSX.Element => {
  const currentDisplayedNotificationPayload = useSelector(
    (storeState: StoreState) => storeState.notifications.currentDisplayedNotificationPayload,
  );
  const [currentFullDisplayedNotificationPayload, setCurrentFullDisplayedNotificationPayload] = useState<any>({});

  useAsyncEffect(async () => {
    switch (currentDisplayedNotificationPayload?.payload?.action) {
      case NotificationTypes.FixClientRequest:
      case NotificationTypes.FixCraftsmanResponse:
        let fixDocument = await fixesService.getFixAsync(
          currentDisplayedNotificationPayload?.payload?.systemPayload?.id,
        );
        setCurrentFullDisplayedNotificationPayload(fixDocument);
      default:
        break;
    }
  }, [currentDisplayedNotificationPayload]);

  const render = (): JSX.Element => {
    if (currentDisplayedNotificationPayload) {
      switch (currentDisplayedNotificationPayload.payload?.action) {
        case NotificationTypes.FixClientRequest:
        case NotificationTypes.FixCraftsmanResponse:
          let notificationDocument = JSON.parse(
            JSON.stringify(currentDisplayedNotificationPayload),
          ) as NotificationDocument;

          let fixDocument = currentFullDisplayedNotificationPayload;
          if (!!fixDocument) {
            fixDocument.assignedToCraftsman = notificationDocument.payload.systemPayload.assignedToCraftsman;
            fixDocument.schedule = notificationDocument.payload.systemPayload.schedule;
            fixDocument.craftsmanEstimatedCost = notificationDocument.payload.systemPayload.craftsmanEstimatedCost;
            notificationDocument.payload.systemPayload = fixDocument;
            if (!!notificationDocument.payload.systemPayload.details) {
              return (
                <FixNotification
                  {...{
                    navRef: props.navRef,
                    currentDisplayedRemoteMessageData: notificationDocument,
                  }}></FixNotification>
              );
            }
          }
          break;
        case NotificationTypes.NewConversation:
          props.navRef.current.navigate('Chat');
          break;
        case NotificationTypes.FixAccepted:
          props.navRef.current.navigate('Fixes');
          break;
        default:
          break;
      }
    }
    return <></>;
  };
  return render();
};
