import { KeyValuePair } from '../KeyValuePair';

export interface DeviceInstallationUpsertRequest {
  UserId: string;
  InstallationId: string;
  Platform: 'fcm' | 'apns';
  PushChannelToken: string;
  Tags: KeyValuePair<string, string>[];
  Templates: any;
}
