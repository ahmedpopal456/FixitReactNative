import { NotificationTypes } from './enums';

export interface NotificationPayloadDto {
  systemPayload: any;
  action: NotificationTypes;
}
