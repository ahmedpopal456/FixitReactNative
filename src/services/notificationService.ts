/* istanbul ignore file */
import {DeviceInstallationUpsertRequest} from 'src/models/notifications/DeviceInstallationUpsertRequest';

export default class NotificationService {
  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  getInstallation(installationId: string): Promise<Response> {
    const route: string = `${this._baseUrl}/Installations/${installationId}`;
    return fetch(route);
  }

  // TODO: change any to actual model
  enqueue(notificationRequest: any): Promise<Response> {
    return fetch(this._baseUrl, {
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
    const route: string = `${this._baseUrl}/Installations`;
    console.log('install NOT from mock')
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
    const route: string = `${this._baseUrl}/Installations/${installationId}`;
    return fetch(route, {method: 'DELETE'});
  }
}
