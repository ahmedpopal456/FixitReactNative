import { NotificationStatus } from './enums';

export interface NotificationStatusUpdateRequestDto {
  id: string;
  status: NotificationStatus;
}
