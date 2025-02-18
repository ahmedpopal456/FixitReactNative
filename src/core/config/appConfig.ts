import ConfigFactory from '../../store/config/factory/configFactory';
import ApplicationTypesEnum from '../../store/models/config/applicationTypesEnum';
import { ConfigModel } from '../../store/models/config/configModel';

// I didn't want to update the Config type so adding it as a const

export const fileApiBaseUrl = 'https://fixitdevfilemsapi.azurewebsites.net/api';

const config: ConfigModel = {
  production: true,
  nmsBaseApiUrl: 'https://fixit-dev-nms-api.azurewebsites.net/api',
  fixApiBaseUrl: 'https://fixit-dev-fms-api.azurewebsites.net/api',
  notificationApiUrl: 'https://fixit-dev-nms-api.azurewebsites.net/api/Notifications',
  chatApiUrl: 'https://fixit-dev-chms-func-api.azurewebsites.net/api/chat',
  chatTriggerUrl: 'https://fixit-dev-chms-func-trigger.azurewebsites.net/api',
  addressApiBaseUrl: 'https://fixit-dev-ums-api.azurewebsites.net/api',
  mdmBaseApiUrl: 'https://fixit-dev-mdm-api.azurewebsites.net/api',
  userApiBaseUrl: 'https://fixit-dev-ums-api.azurewebsites.net/api',
  instrumentationKey: 'de6dcf5f-16f1-48c4-a1ca-fdab7b556dd3',
};

const configFactory = new ConfigFactory();
configFactory.init(ApplicationTypesEnum.MOBILE, config);
export default configFactory.config;
