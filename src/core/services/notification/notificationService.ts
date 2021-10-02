/* istanbul ignore file */
import { DeviceInstallationUpsertRequest } from '../../../common/models/notifications/DeviceInstallationUpsertRequest';

export default class NotificationService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getInstallation(installationId: string): Promise<Response> {
    const route = `${this.baseUrl}/Installations/${installationId}`;
    return fetch(route);
  }

  enqueue(notificationRequest: any): Promise<Response> {
    return fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationRequest),
    });
  }

  installDevice(
    deviceInstallationUpsertRequest: DeviceInstallationUpsertRequest,
  ): Promise<Response> {
    const route = `${this.baseUrl}/Installations`;

    return fetch(route, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceInstallationUpsertRequest),
    });
  }

  uninstallDevice(installationId: string): Promise<Response> {
    const route = `${this.baseUrl}/Installations/${installationId}`;
    return fetch(route, { method: 'DELETE' });
  }
}