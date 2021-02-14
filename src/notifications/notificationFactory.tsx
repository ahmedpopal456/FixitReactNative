import React from 'react';
import {NotificationAction} from 'fixit-common-data-store';
import {
  FixClientRequestNotification,
  FixCraftsmanResponseNotification,
  FixPlanUpdateNotification,
  FixProgressUpdateNotification,
  MessageEntryNotification,
  RatingUpdateNotification,
  NotificationComponent,
} from './components';

export class NotificationFactory {
  public renderNotification(type: NotificationAction, props: any) {
    switch (type) {
      case NotificationAction.FIX_CLIENT_REQUEST:
        return <FixClientRequestNotification {...props} />;

      case NotificationAction.FIX_CRAFTSMAN_RESPONSE:
        return <FixCraftsmanResponseNotification {...props} />;

      case NotificationAction.FIX_PLAN_UPDATE:
        return <FixPlanUpdateNotification {...props} />;

      case NotificationAction.FIX_PROGRESS_UPDATE:
        return <FixProgressUpdateNotification {...props} />;

      case NotificationAction.MESSAGE_ENTRY:
        return <MessageEntryNotification {...props} />;

      case NotificationAction.RATING_UPDATE:
        return <RatingUpdateNotification {...props} />;

      default:
        return <NotificationComponent {...props} />;
    }
  }
}
