import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { Initialization } from '@microsoft/applicationinsights-web/types/Initialization';
// eslint-disable-next-line import/no-unresolved
import { INSTRUMENTATION_KEY } from '@env';

export default class Logger {
  private static appInsights: Initialization;

  public static get instance(): Initialization {
    if (!this.appInsights) {
      this.appInsights = new ApplicationInsights({
        config: {
          instrumentationKey: INSTRUMENTATION_KEY,
        },
      });
    }

    return this.appInsights;
  }
}
