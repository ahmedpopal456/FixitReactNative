import ApplicationTypesEnum from '../../models/config/applicationTypesEnum';
import { ConfigModel } from '../../models/config/configModel';
import MobileConfigProvider from '../providers/mobileConfigProvider';

export default class ConfigFactory {
  private configProvider!: MobileConfigProvider;

  public init(type: ApplicationTypesEnum, config: ConfigModel): void {
    if (type === ApplicationTypesEnum.MOBILE) {
      this.configProvider = new MobileConfigProvider();
    }
    this.configProvider.defineConfig(config);
  }

  public get config(): MobileConfigProvider {
    return this.configProvider;
  }
}
