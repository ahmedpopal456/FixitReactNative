import React from 'react';
import { ImageBackground, View } from 'react-native';
import { Button } from 'fixit-common-ui';
import { MSALResult, MSALWebviewParams } from 'react-native-msal';
import B2CClient from '../b2c/b2cClient';
import { b2cConfig, b2cScopes as scopes } from '../config/msalConfig';
import bgImage from '../assets/fixitRegisterBg.png';

export default class RegisterPage extends
  React.Component<unknown, { authResult: MSALResult | null, iosEphemeralSession: boolean }> {
  b2cClient = new B2CClient(b2cConfig);

  // Whether the session should ask the browser for a private authentication session for iOS
  webviewParameters: MSALWebviewParams = {
    ios_prefersEphemeralWebBrowserSession: false,
  };

  constructor(props: unknown | Readonly<unknown>) {
    super(props);
    this.state = {
      authResult: null,
      iosEphemeralSession: false,
    };
  }

  componentDidMount(): void {
    this.init();
  }

  async init(): Promise<void> {
    const isSignedIn = await this.b2cClient.isSignedIn();
    if (isSignedIn) {
      this.setState({ authResult: await this.b2cClient.acquireTokenSilent({ scopes }) });
    }
  }

  handleSignUpPress = async () : Promise<void> => {
    const result: MSALResult = await this.b2cClient.signUp({ scopes });
    this.setState({ authResult: result });
  };

  handleSignInPress = async () : Promise<void> => {
    const { webviewParameters } = this;
    const result = await this.b2cClient.signIn({ scopes, webviewParameters });
    this.setState({ authResult: result });
  };

  handleAcquireTokenPress = async () : Promise<void> => {
    const result = await this.b2cClient.acquireTokenSilent({ scopes });
    this.setState({ authResult: result });
  };

  handleSignOutPress = async () : Promise<void> => {
    await this.b2cClient.signOut();
    this.setState({ authResult: null });
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
        {this.state.authResult ? (
          <View style={{ flexDirection: 'row' }}>
            <Button onPress={this.handleAcquireTokenPress} width={100}>
            Get Token
            </Button>
            <Button onPress={this.handleSignOutPress} width={100}>
            Sign Out
            </Button>
          </View>
        ) : (
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
        )}
        <Button onPress={() => this.props.navigation.navigate('Main')} width={125} color="accent">
        Skip (temporary)
        </Button>
      </ImageBackground>
    );
  }
}
