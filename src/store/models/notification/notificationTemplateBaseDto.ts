import { NotificationTagDto } from './notificationTagDto';
export interface NotificationTemplateBaseDto {
  body: string;
  tags: NotificationTagDto[];
}
