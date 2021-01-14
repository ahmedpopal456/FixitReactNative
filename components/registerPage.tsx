import React from 'react';
import {ImageBackground, View} from 'react-native';
import {Button} from 'fixit-common-ui';
import {MSALResult, MSALWebviewParams} from 'react-native-msal';
import B2CClient from '../b2c/b2cClient';
import {b2cConfig, b2cScopes as scopes} from '../b2c/msalConfig';


export default class RegisterPage extends React.Component<{}, { authResult: MSALResult | null, iosEphemeralSession: boolean }> {
  b2cClient = new B2CClient(b2cConfig);
  // Whether the session should ask the browser for a private authentication session for iOS
  webviewParameters: MSALWebviewParams = {
    ios_prefersEphemeralWebBrowserSession: false,
  };
  
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      authResult: null,
      iosEphemeralSession: false
    };
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    const isSignedIn = await this.b2cClient.isSignedIn();
    if (isSignedIn) {
      this.setState({ authResult: await this.b2cClient.acquireTokenSilent({scopes}) });
    }
  }

  handleSignUpPress = async () => {
    try {
      const result: MSALResult = await this.b2cClient.signUp({scopes});
      this.setState({ authResult: result });
    } catch (error) {
      console.warn(error);
    }
  };

  handleSignInPress = async () => {
    try {
      let webviewParameters = this.webviewParameters;
      const result = await this.b2cClient.signIn({scopes, webviewParameters});
      this.setState({ authResult: result });
    } catch (error) {
      console.warn(error);
    }
  };

  handleAcquireTokenPress = async () => {
    try {
      const result = await this.b2cClient.acquireTokenSilent({scopes});
      this.setState({ authResult: result });
    } catch (error) {
      console.warn(error);
    }
  };

  handleSignOutPress = async () => {
    try {
      await this.b2cClient.signOut();
      this.setState({ authResult: null });
    } catch (error) {
      console.warn(error);
    }
  };

  render() {
    return (
      <ImageBackground
      source={require('../assets/fixitRegisterBg.png')}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      {this.state.authResult ? (
        <View style={{flexDirection: 'row'}}>
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
    </ImageBackground>
    );
  }
}
