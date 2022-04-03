import { NotificationPayloadDto } from '.';
import { UserBaseModel } from '../user';
import { NotificationStatus, NotificationTypes } from './enums';

export interface NotificationDocument {
  id: string;
  entityId: string;
  title: string;
  message: string;
  payload: NotificationPayloadDto;
  action: NotificationTypes;
  recipientUser: UserBaseModel;
  status: NotificationStatus;
  silent: boolean;
  createdTimestampUtc: number;
  updatedTimestampUtc: number;
}
