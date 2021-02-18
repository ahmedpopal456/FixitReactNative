import {
  MSALInteractiveParams,
  MSALSignoutParams,
  MSALConfiguration,
  MSALResult,
  MSALWebviewParams,
} from 'react-native-msal';

  interface B2CPolicies {
      signIn: string;
      signUp: string;
      passwordReset?: string;
      editProfile?: string;
    }

export type B2CConfiguration = Omit<MSALConfiguration, 'auth'> & {
      auth: {
        clientId: string;
        authorityBase: string;
        policies: B2CPolicies;
        redirectUri?: string;
      };
    };

export type B2CSignInUpParams = Omit<MSALInteractiveParams, 'authority'>;
export type B2CSignOutParams = Pick<MSALSignoutParams, 'signoutFromBrowser' | 'webviewParameters'>;
export type { MSALResult };
export type { MSALWebviewParams };
