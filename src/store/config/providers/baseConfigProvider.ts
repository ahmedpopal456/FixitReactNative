import { ConfigModel } from '../../models/config/configModel';

export default abstract class BaseConfigProvider {
  protected config!: ConfigModel;

  public defineConfig(config: ConfigModel): void {
    this.config = config;
  }

  public get isProduction(): boolean {
    return this.config.production;
  }

  public get userApiBaseUrl(): string {
    return this.config.userApiBaseUrl;
  }

  public get fixApiBaseUrl(): string {
    return this.config.fixApiBaseUrl;
  }

  public get instrumentationKey(): string {
    return this.config.instrumentationKey;
  }

  public get addressApiBaseUrl(): string {
    return this.config.addressApiBaseUrl;
  }

  public get nmsBaseApiUrl(): string {
    return this.config.nmsBaseApiUrl;
  }

  public get mdmBaseApiUrl(): string {
    return this.config.mdmBaseApiUrl;
  }

  public get chatBaseApiUrl(): string {
    return this.config.chatApiUrl;
  }

  public get rawConfig(): ConfigModel {
    return this.config;
  }
}
