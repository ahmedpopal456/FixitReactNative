import { UserBaseModel } from '../user';
import { NotificationPayloadDto } from './notificationPayloadDto';
import { NotificationTagDto } from './notificationTagDto';

export interface EnqueueNotificationRequestDto {
  title: string;
  message: string;
  payload: NotificationPayloadDto;
  tags: NotificationTagDto[];
  recipientUsers: UserBaseModel[];
  silent: boolean;
}
