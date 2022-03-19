import { NotificationPlatform } from './enums';
import { NotificationTagDto } from './notificationTagDto';
import { NotificationTemplateBaseDto } from './notificationTemplateBaseDto';

export interface DeviceInstallation {
  installationId: string;
  platform: NotificationPlatform;
  pushChannelToken: string;
  pushChannelTokenExpired: boolean;
  tags: NotificationTagDto[];
  templates: { [key: string]: NotificationTemplateBaseDto };
  userId: string;
  installedTimestampUtc: number;
  updatedTimestampUtc: number;
}
