import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { Initialization } from '@microsoft/applicationinsights-web/types/Initialization';
import config from './core/config/appConfig';

export default class Logger {
  private static appInsights: Initialization;

  public static get instance(): Initialization {
    if (!this.appInsights) {
      this.appInsights = new ApplicationInsights({
        config: {
          instrumentationKey: config.instrumentationKey,
        },
      });
    }

    return this.appInsights;
  }
}
