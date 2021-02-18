import React from 'react';
import { ImageBackground, View } from 'react-native';
import { Button } from 'fixit-common-ui';
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
          <Button onPress={this.handleSignInPress} width={125}>
            Log In
          </Button>
          <Button onPress={this.handleSignUpPress} width={125} color="accent">
            Sign Up
          </Button>
        </View>
      </ImageBackground>
    );
  }
}
