import PublicClientApplication, {
  MSALInteractiveParams,
  MSALResult,
  MSALSilentParams,
  MSALAccount,
  MSALSignoutParams,
  MSALWebviewParams,
  MSALConfiguration,
} from 'react-native-msal';
import { Platform } from 'react-native';
import * as constants from '../src/constants';

export interface B2CPolicies {
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
export type B2CAcquireTokenSilentParams = Pick<MSALSilentParams, 'forceRefresh' | 'scopes'>;
export type B2CSignOutParams = Pick<MSALSignoutParams, 'signoutFromBrowser' | 'webviewParameters'>;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default class B2CClient {
  // This error code is returned when the user clicks on Forgot Password button. 
  // Therefore, its used to handle and open the b2c page
  // https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview#linking-user-flows
  private static readonly B2C_PASSWORD_CHANGE = 'AADB2C90118';
  private publicClientApplication: PublicClientApplication;

  /** Construct a B2CClient object
   * @param clientId The id of the b2c application
   * @param authorityBase The authority URL, without a policy name.
   * Has the form: https://TENANT_NAME.b2clogin.com/tfp/TENANT_NAME.onmicrosoft.com/
   * @param policies An object containing the policies you will be using.
   * The sign in sign up policy is required, the rest are optional
   */
  constructor(private readonly b2cConfig: B2CConfiguration) {
    // Set the default authority for the PublicClientApplication (publicClientApplication). If we don't provide one,
    // it will use the default, common authority
    const { authorityBase: _, policies, ...restOfAuthConfig } = this.b2cConfig.auth;
    const authority = this.getAuthority(policies.signIn);
    const knownAuthorities: string[] = Object.values(policies).map((policy) => this.getAuthority(policy));
    this.publicClientApplication = new PublicClientApplication({
      ...this.b2cConfig,
      auth: { authority, knownAuthorities, ...restOfAuthConfig },
    });
  }

  public async signUp(b2cSignInUpParams: B2CSignInUpParams): Promise<MSALResult> {
    const isSignedIn = await this.isSignedIn();
    if (isSignedIn) {
      throw Error(constants.ALREADY_SIGNED_IN_ERROR);
    }

    try {
      // ...rest is used to destructure the parameters into
      // individual element of a "list" of b2cSignInUpParams
      // so that we can pass it to the parameters of acquireToken()
      const { ...rest } = b2cSignInUpParams;
      const authority = this.getAuthority(this.b2cConfig.auth.policies.signUp);
      return await this.publicClientApplication.acquireToken({ ...rest, authority });
    }
    catch (error) {
      throw error;
    }
  }

  /** Initiates an interactive sign-in. If the user clicks "Forgot Password", and a reset password policy
   *  was provided to the client, it will initiate the password reset flow
   */
  public async signIn(b2cSignInUpParams: B2CSignInUpParams): Promise<MSALResult> {
    const isSignedIn = await this.isSignedIn();
    if (isSignedIn) {
      throw Error(constants.ALREADY_SIGNED_IN_ERROR);
    }

    try {
      return await this.publicClientApplication.acquireToken(b2cSignInUpParams);
    } catch (error) {
      if (error.message.includes(B2CClient.B2C_PASSWORD_CHANGE) && this.b2cConfig.auth.policies.passwordReset) {
        return await this.resetPassword(b2cSignInUpParams);
      } else {
        throw error;
      }
    }
  }

  /** Gets a token silently. Will only work if the user is already signed in */
  public async acquireTokenSilent(b2cAcquireTokenSilentParams: B2CAcquireTokenSilentParams) {
    const account = await this.getAccountForPolicy(this.b2cConfig.auth.policies.signIn);
    if (account) {
      return await this.publicClientApplication.acquireTokenSilent({ ...b2cAcquireTokenSilentParams, account });
    } else {
      throw Error(constants.ACQUIRE_TOKEN_ERROR);
    }
  }

  /** Returns true if a user is signed in, false if not */
  public async isSignedIn() {
    const signInAccount = await this.getAccountForPolicy(this.b2cConfig.auth.policies.signIn);
    return signInAccount !== undefined;
  }

  /** Removes all accounts from the device for this app. User will have to sign in again to get a token */
  public async signOut(params?: B2CSignOutParams) {
    const accounts = await this.publicClientApplication.getAccounts();
    const signOutPromises = accounts.map((account) => this.publicClientApplication.signOut({ ...params, account }));
    await Promise.all(signOutPromises);
    return true;
  }

  private async resetPassword(params: B2CSignInUpParams) {
    const { webviewParameters: wvp, ...rest } = params;
    const webviewParameters: MSALWebviewParams = {
      ...wvp,
      ios_prefersEphemeralWebBrowserSession: true,
    };
    if (this.b2cConfig.auth.policies.passwordReset) {
      if (Platform.OS === 'ios') {
        await delay(1000);
      }
      const authority = this.getAuthority(this.b2cConfig.auth.policies.passwordReset);
      await this.publicClientApplication.acquireToken({ ...rest, webviewParameters, authority });
      return await this.signIn(params);
    } else {
      throw Error(constants.PASSWORD_RESET_ERROR);
    }
  }

  /** Finds an account given the policy */
  private async getAccountForPolicy(policy: string): Promise<MSALAccount | undefined> {
    const accounts = await this.publicClientApplication.getAccounts();
    return accounts.find((account) => account.identifier.includes(policy.toLowerCase()));
  }

  private getAuthority(policy: string): string {
    return `${this.b2cConfig.auth.authorityBase}/${policy}`;
  }

}
