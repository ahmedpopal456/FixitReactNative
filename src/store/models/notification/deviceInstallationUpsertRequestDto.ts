import { NotificationTemplateBaseDto } from './notificationTemplateBaseDto';
import { NotificationTagDto } from './notificationTagDto';
import { NotificationPlatform } from './enums';

export interface DeviceInstallationUpsertRequestDto {
  userId: string;
  installationId: string;
  platform: NotificationPlatform;
  pushChannelToken: string;
  tags: NotificationTagDto[];
  templates?: NotificationTemplateBaseDto[] | null;
}
