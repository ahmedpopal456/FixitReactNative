import React from 'react';
import { ImageBackground, View } from 'react-native';
import { Button } from 'fixit-common-ui';
import { persistentStore, persistentActions } from 'fixit-common-data-store';
import NativeAuthService from '../services/nativeAuthService';
import { b2cConfig, b2cScopes as scopes } from '../config/msalConfig';
import bgImage from '../assets/fixitRegisterBg.png';
import { RegisterScreenProps } from '../models/auth/registerScreenProps';
import { MSALWebviewParams } from '../models/auth/B2CTypes';

export default class RegisterScreen extends
  React.Component<RegisterScreenProps> {
  b2cClient = new NativeAuthService(b2cConfig);

  // Whether the session should ask the browser for a private authentication session for iOS
  webviewParameters: MSALWebviewParams = {
    ios_prefersEphemeralWebBrowserSession: false,
  };

  handleSignUpPress = async () : Promise<void> => {
    this.b2cClient.signUp({ scopes });
  };

  handleSignInPress = async () : Promise<void> => {
    const { webviewParameters } = this;
    this.b2cClient.signIn({ scopes, webviewParameters });
  };

  handleAcquireTokenPress = async () : Promise<void> => {
    this.b2cClient.acquireTokenSilent();
  };

  handleSignOutPress = async () : Promise<void> => {
    this.b2cClient.signOut();
  };

  render() : JSX.Element {
    return (
      <ImageBackground
        source={bgImage}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* Skip used for E2E testing. Remove when you are not testing. */}
        {/* <Button
          testID='skipClient'
          onPress={() => {
            persistentStore.dispatch(
              persistentActions.default.setAuthStatus(true, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImtYTGVJemxsTFFnR1I4Q3ZSV1dKVVJTQ0ZHSG8zMVk0ZmlYa1h6X25hdk0ifQ.eyJpc3MiOiJodHRwczovL2ZpeGl0YjJjdGVzdC5iMmNsb2dpbi5jb20vYjU5MDgyNmYtZGJiNC00ZjJjLTlmNzItY2ZjOWVhMTE2YjVkL3YyLjAvIiwiZXhwIjoxNjE4MDkyMDU3LCJuYmYiOjE2MTgwODg0NTcsImF1ZCI6IjYwZDBkN2NlLTg1ZmYtNDI3ZC1hZTI2LThlMTUxMGJiNzc2ZCIsInN1YiI6IjdmMTNjZDk0LWI3N2QtNGFkZC05YjZjLTU2ODU3ZTQzODRiMyIsIm5hbWUiOiJ1bmtub3duIiwiZ2l2ZW5fbmFtZSI6IkZyYW5jZXMiLCJmYW1pbHlfbmFtZSI6IkFsdmFyZXoiLCJ0aWQiOiJiNTkwODI2Zi1kYmI0LTRmMmMtOWY3Mi1jZmM5ZWExMTZiNWQiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJhenAiOiI2MGQwZDdjZS04NWZmLTQyN2QtYWUyNi04ZTE1MTBiYjc3NmQiLCJ2ZXIiOiIxLjAiLCJpYXQiOjE2MTgwODg0NTd9.TBVIaYAewryWcnjrjOTTSos-U0F0jMFO7oUYIRQgbwQnuqF7-PoUvMFQdleAvDxEXUJN08xmlFgVrqhbp6tI9mWR6LVqIUDM2OrE0yQC0Ht5Hh2iTD9NaZTm_c4qCIsOrF1FfALZE8k2HMp51OrEiJHY69dvEF8Hqq0V81Q4vyf-mIjUKiG3cXffR4r06kCSUUAcjR7Gsol7GrcSeIYuDnTmYxWgLQERch9zBjavctQnQ8TGN2TMhz9yXy7Tcg2q1ZaQT-yMq6mB6U2-6HAnuHxcrrSHteiU6_imu113W8bIlckx8Q_ymmjRf-hCzVKoM77KNlVUzYK2Rpv3XcPOnQ'),
            );
            persistentStore.dispatch(
              persistentActions.default.setUserInfo(
                '7f13cd94-b77d-4add-9b6c-56857e4384b3', 'Frances', 'Alvarez', 'fixtestperson@gmail.com', 0, { status: 1, lastSeenTimestampUtc: 1 },
              ),
            );
          }}
          width={125}
          color="accent"
        >
          Skip (Client)
        </Button>
        <Button
          testID='skipCraftsman'
          onPress={() => {
            persistentStore.dispatch(
              persistentActions.default.setAuthStatus(true, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImtYTGVJemxsTFFnR1I4Q3ZSV1dKVVJTQ0ZHSG8zMVk0ZmlYa1h6X25hdk0ifQ.eyJleHAiOjE2MTgxMTI4MDEsIm5iZiI6MTYxODEwOTIwMSwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9maXhpdGIyY3Rlc3QuYjJjbG9naW4uY29tL2I1OTA4MjZmLWRiYjQtNGYyYy05ZjcyLWNmYzllYTExNmI1ZC92Mi4wLyIsInN1YiI6ImQzMTczNDBiLTE3YmYtNGRiYS05NDRhLTg1NmEyNWVhYThlZCIsImF1ZCI6IjYwZDBkN2NlLTg1ZmYtNDI3ZC1hZTI2LThlMTUxMGJiNzc2ZCIsImFjciI6ImIyY18xYV9zaWduaW4iLCJpYXQiOjE2MTgxMDkyMDEsImF1dGhfdGltZSI6MTYxODEwOTIwMCwibmFtZSI6InVua25vd24iLCJnaXZlbl9uYW1lIjoiVGltIiwiZmFtaWx5X25hbWUiOiJNeWVycyIsInRpZCI6ImI1OTA4MjZmLWRiYjQtNGYyYy05ZjcyLWNmYzllYTExNmI1ZCIsImF0X2hhc2giOiJxVlFPWXVMRGpOakJGM3NFeDNtNXdRIn0.NUp_wq5mU5bIWANDD47wXe6P1nRjOKk3x9gEcKlPBANiAwGMDRdSQt0bsNoSE3Vjgsc-twRkmEmv5luSsauo3RmSX9V2kQ9u84bRXDDMIBhcw5yCHlz6RLmi29Af7TzB7tYGbuV_LdexHJWR5doo3WQ3wf0rvnVsxGlFjJmGWhb86pRzkLJnsxgnB0dQ0kO2P2CEXxR3g69WBQajC9Sf05mkeDl_pa_fM8hakID9n2T_MoAc98CRHox9X1s0yx5vqHuJ61oj3DpiNtZe0eYwpbQdVmEobqMiy3SV2RtpB2qq1rXYh9sotSCBhPpiPI7zRPbtDQwymjEG7nmW1ZscRQ'),
            );
            persistentStore.dispatch(
              persistentActions.default.setUserInfo(
                'd317340b-17bf-4dba-944a-856a25eaa8ed', 'Timmy', 'Myers', 'f.i.x.testperson@gmail.com', 1, { status: 1, lastSeenTimestampUtc: 1 },
              ),
            );
          }}
          width={125}
          color="accent"
        >
          Skip (Craftsman)
        </Button> */}
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            backgroundColor: '#1D1F2A',
            position: 'absolute',
            bottom: 50,
            padding: 10,
            borderRadius: 7,
          }}
        >
          <Button testID='loginButton' onPress={this.handleSignInPress} width={125}>
            Log In
          </Button>
          <Button testID='signupButton' onPress={this.handleSignUpPress} width={125} color="accent">
            Sign Up
          </Button>
        </View>
      </ImageBackground>
    );
  }
}
