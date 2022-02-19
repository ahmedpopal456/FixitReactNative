import React from 'react';
import { ImageBackground, View } from 'react-native';
import { Button } from 'fixit-common-ui';
import { StackNavigationProp } from '@react-navigation/stack';
import NativeAuthService from '../../../core/services/authentication/nativeAuthService';
import { b2cConfig, b2cScopes as scopes } from '../../../core/config/msalConfig';
import bgImage from '../../../common/assets/fixitRegisterBg.png';
import { MSALWebviewParams } from '../../../common/models/auth/B2CTypes';

NativeAuthService.setInstance(b2cConfig);

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

type RegisterScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Auth'>;

export type RegisterScreenProps = {
  navigation: RegisterScreenNavigationProps;
};

export default class RegisterScreen extends React.Component<RegisterScreenProps> {
  webviewParameters: MSALWebviewParams = {
    ios_prefersEphemeralWebBrowserSession: false,
  };

  handleSignUpPress = async (): Promise<void> => {
    NativeAuthService.signUp({ scopes });
  };

  handleSignInPress = async (): Promise<void> => {
    const { webviewParameters } = this;
    NativeAuthService.signIn({ scopes, webviewParameters });
  };

  handleAcquireTokenPress = async (): Promise<void> => {
    NativeAuthService.acquireTokenSilent();
  };

  handleSignOutPress = async (): Promise<void> => {
    NativeAuthService.signOut();
  };

  render(): JSX.Element {
    return (
      <ImageBackground
        source={bgImage}
        style={{
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            backgroundColor: '#1D1F2A',
            position: 'absolute',
            bottom: 50,
            padding: 10,
            borderRadius: 7,
          }}>
          <Button testID="loginButton" onPress={this.handleSignInPress} width={125}>
            Log In
          </Button>
          <Button testID="signupButton" onPress={this.handleSignUpPress} width={125} color="accent">
            Sign Up
          </Button>
        </View>
      </ImageBackground>
    );
  }
}
