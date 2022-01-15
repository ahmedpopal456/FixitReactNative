import PublicClientApplication from 'react-native-msal';
import { ConfigFactory, store, userActions, UserService } from 'fixit-common-data-store';
import jwtDecode from 'jwt-decode';
import * as constants from '../constants/authConstants';
import {
  B2CConfiguration,
  B2CSignInUpParams,
  B2CSignOutParams,
  MSALResult,
  MSALWebviewParams,
} from '../../../common/models/auth/B2CTypes';

const userService = new UserService(new ConfigFactory(), store);

export default class NativeAuthService {
  // This error code is returned when the user clicks on Forgot Password button.
  // Therefore, its used to handle and open the b2c page
  // https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview#linking-user-flows
  private static readonly B2C_PASSWORD_CHANGE = 'AADB2C90118';

  private publicClientApplication: PublicClientApplication;

  /** Construct a NativeAuthService object
   * @param clientId The id of the b2c application
   * @param authorityBase The authority URL, without a policy name.
   * Has the form: https://TENANT_NAME.b2clogin.com/tfp/TENANT_NAME.onmicrosoft.com/
   * @param policies An object containing the policies you will be using.
   * The sign in sign up policy is required, the rest are optional
   */
  constructor(private readonly b2cConfig: B2CConfiguration) {
    // Set the default authority for the PublicClientApplication (publicClientApplication).
    // If we don't provide one,
    // it will use the default, common authority
    const { policies, ...restOfAuthConfig } = this.b2cConfig.auth;
    const authority = this.getAuthority(policies.signIn);
    const knownAuthorities: string[] = Object.values(policies).map((policy) => this.getAuthority(policy));
    this.publicClientApplication = new PublicClientApplication({
      auth: {
        authority: 'https://fixitb2ctest.b2clogin.com/tfp/b590826f-dbb4-4f2c-9f72-cfc9ea116b5d/B2C_1A_SIGNIN',
        knownAuthorities: ['https://fixitb2ctest.b2clogin.com/tfp/b590826f-dbb4-4f2c-9f72-cfc9ea116b5d/B2C_1A_SIGNIN'],
        redirectUri: 'msauth.org.reactjs.native.example.FixitReactNative://auth',
        clientId: '60d0d7ce-85ff-427d-ae26-8e1510bb776d',
      },
    });

    try {
      this.publicClientApplication.init();
    } catch (error) {
      console.error('Error initializing the publicClientApplication, check your config.', error);
    }
  }

  public async signUp(b2cSignInUpParams: B2CSignInUpParams): Promise<MSALResult> {
    if (this.isSignedIn()) {
      throw Error(constants.ALREADY_SIGNED_IN_ERROR);
    }

    // ...rest is used to destructure the parameters into
    // individual element of a "list" of b2cSignInUpParams
    // so that we can pass it to the parameters of acquireToken()
    const { ...rest } = b2cSignInUpParams;
    const authority = this.getAuthority(this.b2cConfig.auth.policies.signUp);
    const msalResult = await this.publicClientApplication.acquireToken({
      ...rest,
      authority,
    });

    const decodedAuthToken: { sub: string } = jwtDecode(msalResult.accessToken);
    const userId = decodedAuthToken.sub;

    store.dispatch(userActions.UPDATE_AUTH_STATUS({ isAuthenticated: true, authToken: msalResult.accessToken }));

    userService.fetchUser(userId);
    return msalResult;
  }

  /** Initiates an interactive sign-in.
   * If the user clicks "Forgot Password", and a reset password policy
   *  was provided to the client, it will initiate the password reset flow
   */
  public async signIn(b2cSignInUpParams: B2CSignInUpParams): Promise<MSALResult> {
    if (this.isSignedIn()) {
      throw Error(constants.ALREADY_SIGNED_IN_ERROR);
    }

    try {
      const msalResult = await this.publicClientApplication.acquireToken(b2cSignInUpParams);

      const decodedAuthToken: { sub: string } = jwtDecode(msalResult.accessToken);
      const userId = decodedAuthToken.sub;
      store.dispatch(userActions.UPDATE_AUTH_STATUS({ isAuthenticated: true, authToken: msalResult.accessToken }));

      userService.fetchUser(userId);
      return msalResult;
    } catch (error: any) {
      if (error.message.includes(NativeAuthService.B2C_PASSWORD_CHANGE) && this.b2cConfig.auth.policies.passwordReset) {
        return this.resetPassword(b2cSignInUpParams);
      }
      throw error;
    }
  }

  /** Gets a token silently. Will only work if the user is already signed in */
  public acquireTokenSilent(): string {
    const state = store.getState();

    if (this.isSignedIn()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return state.user.authToken!;
    }

    throw Error(constants.NOT_SIGNED_IN_ERROR);
  }

  /** Returns true if a user is signed in, false if not */
  // eslint-disable-next-line class-methods-use-this
  public isSignedIn(): boolean {
    const state = store.getState();

    if (state.user.isAuthenticated && state.user.authToken) {
      return true;
    }

    if (!state.user.isAuthenticated && state.user.authToken) {
      throw Error(constants.NO_TOKEN_SET);
    }

    return false;
  }

  /** Removes all accounts from the device for this app.
    User will have to sign in again to get a token */
  public async signOut(params?: B2CSignOutParams): Promise<boolean> {
    const accounts = await this.publicClientApplication.getAccounts();
    const signOutPromises = accounts.map((account: any) =>
      this.publicClientApplication.signOut({ ...params, account }),
    );
    await Promise.all(signOutPromises);
    store.dispatch(userActions.UPDATE_AUTH_STATUS({ isAuthenticated: false, authToken: '' }));
    return true;
  }

  private async resetPassword(params: B2CSignInUpParams) {
    const { webviewParameters: wvp, ...rest } = params;
    const webviewParameters: MSALWebviewParams = {
      ...wvp,
      ios_prefersEphemeralWebBrowserSession: true,
    };
    if (this.b2cConfig.auth.policies.passwordReset) {
      const authority = this.getAuthority(this.b2cConfig.auth.policies.passwordReset);
      await this.publicClientApplication.acquireToken({
        ...rest,
        webviewParameters,
        authority,
      });
      return this.signIn(params);
    }
    throw Error(constants.PASSWORD_RESET_ERROR);
  }

  private getAuthority(policy: string): string {
    return `${this.b2cConfig.auth.authorityBase}/${policy}`;
  }
}
