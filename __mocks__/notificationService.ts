export default class NotificationService {
  installDevice(
    deviceInstallationUpsertRequest: DeviceInstallationUpsertRequest,
  ): Promise<Response> {
    console.log('installing from mock')
    return Promise.resolve(new Response());
  }
}

