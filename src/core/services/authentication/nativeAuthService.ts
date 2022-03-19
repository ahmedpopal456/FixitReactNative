import PublicClientApplication from 'react-native-msal';
import { rootReducerActions, store, userActions, UserService } from '../../../store';
import jwtDecode from 'jwt-decode';
import * as constants from '../constants/authConstants';
import {
  B2CConfiguration,
  B2CSignInUpParams,
  B2CSignOutParams,
  MSALResult,
  MSALWebviewParams,
} from '../../../common/models/auth/B2CTypes';
import config from '../../../core/config/appConfig';
import Logger from '../../../logger';

const userService = new UserService(config, store);

export default class NativeAuthService {
  private static readonly B2C_PASSWORD_CHANGE = 'AADB2C90118';

  private static instance: NativeAuthService;
  private publicClientApplication: PublicClientApplication;

  private constructor(private readonly b2cConfig: B2CConfiguration) {
    const { policies, ...restOfAuthConfig } = this.b2cConfig.auth;
    const authority = `${this.b2cConfig.auth.authorityBase}/${policies.signIn}`;
    const knownAuthorities: string[] = Object.values(policies).map(
      (policy) => `${this.b2cConfig.auth.authorityBase}/${policy}`,
    );
    this.publicClientApplication = new PublicClientApplication({
      ...this.b2cConfig,
      auth: { authority, knownAuthorities, ...restOfAuthConfig },
    });
  }

  public static setInstance(b2cConfig: B2CConfiguration): NativeAuthService {
    if (!this.instance) {
      this.instance = new NativeAuthService(b2cConfig);
      NativeAuthService.init();
    }
    return this.instance;
  }

  public static getInstance(): NativeAuthService | null {
    let localInstance: NativeAuthService | null = null;
    if (!!this.instance) {
      localInstance = this.instance;
    }
    return localInstance;
  }

  private static async init() {
    if (!!this.instance) {
      try {
        this.instance.publicClientApplication = await this.instance.publicClientApplication.init();
      } catch (error: any) {
        Logger.instance.trackException({
          exception: error as any,
        });
      }
    }
  }

  public static async signIn(b2cSignInUpParams: B2CSignInUpParams): Promise<MSALResult | undefined> {
    if (this.isSignedIn()) {
      throw Error(constants.ALREADY_SIGNED_IN_ERROR);
    }

    try {
      const msalResult = await this.instance.publicClientApplication.acquireToken(b2cSignInUpParams);
      const decodedAuthToken: { sub: string } = jwtDecode(msalResult?.accessToken as string);
      const userId = decodedAuthToken.sub;

      store.dispatch(userActions.UPDATE_AUTH_STATUS({ isAuthenticated: true, authToken: msalResult?.accessToken }));
      await userService.fetchUser(userId);
      return msalResult;
    } catch (error: any) {
      Logger.instance.trackException({
        exception: error as any,
      });
      if (
        error.message.includes(NativeAuthService.B2C_PASSWORD_CHANGE) &&
        this.instance.b2cConfig.auth.policies.passwordReset
      ) {
        return this.resetPassword(b2cSignInUpParams);
      }
      throw error;
    }
  }

  public static async signUp(b2cSignInUpParams: B2CSignInUpParams): Promise<MSALResult | undefined> {
    if (this.isSignedIn()) {
      throw Error(constants.ALREADY_SIGNED_IN_ERROR);
    }

    const { ...rest } = b2cSignInUpParams;
    const authority = this.getAuthority(this.instance.b2cConfig.auth.policies.signUp);
    const msalResult = await this.instance.publicClientApplication.acquireToken({
      ...rest,
      authority,
    });

    const decodedAuthToken: { sub: string } = jwtDecode(msalResult?.accessToken as string);
    const userId = decodedAuthToken.sub;

    store.dispatch(
      userActions.UPDATE_AUTH_STATUS({ isAuthenticated: true, authToken: msalResult?.accessToken as string }),
    );

    userService.fetchUser(userId);
    return msalResult;
  }

  public static acquireTokenSilent(): string {
    const state = store.getState();

    if (this.isSignedIn()) {
      return state.user.authToken!;
    }

    throw Error(constants.NOT_SIGNED_IN_ERROR);
  }

  public static isSignedIn(): boolean {
    const state = store.getState();

    if (state.user.isAuthenticated && state.user.authToken) {
      return true;
    }

    if (!state.user.isAuthenticated && state.user.authToken) {
      throw Error(constants.NO_TOKEN_SET);
    }

    return false;
  }

  public static async signOut(params?: B2CSignOutParams): Promise<boolean> {
    const accounts = await this.instance.publicClientApplication.getAccounts();
    const signOutPromises = accounts.map((account: any) =>
      this.instance.publicClientApplication.signOut({ ...params, account }),
    );
    await Promise.all(signOutPromises);
    store.dispatch(rootReducerActions.RESET_ROOT_STATE());
    return true;
  }

  private static async resetPassword(params: B2CSignInUpParams) {
    const { webviewParameters: wvp, ...rest } = params;
    const webviewParameters: MSALWebviewParams = {
      ...wvp,
      ios_prefersEphemeralWebBrowserSession: true,
    };
    if (this.instance.b2cConfig.auth.policies.passwordReset) {
      const authority = this.getAuthority(this.instance.b2cConfig.auth.policies.passwordReset);
      await this.instance.publicClientApplication.acquireToken({
        ...rest,
        webviewParameters,
        authority,
      });
      return this.signIn(params);
    }
    throw Error(constants.PASSWORD_RESET_ERROR);
  }

  private static getAuthority(policy: string): string {
    return `${this.instance.b2cConfig.auth.authorityBase}/${policy}`;
  }
}
