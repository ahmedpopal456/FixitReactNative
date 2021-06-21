import React from 'react';
import {
  SafeAreaView, Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import {
  store, connect, StoreState, AddressModel,
} from 'fixit-common-data-store';
import NativeAuthService from '../../../core/services/authentication/nativeAuthService';
import { b2cConfig } from '../../../core/config/msalConfig';

const b2cClient = new NativeAuthService(b2cConfig);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  bodyContainer: {
    backgroundColor: 'white',
    flexGrow: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonsContainer: {
    overflow: 'scroll',
    width: '95%',
  },
  buttonFirst: {
    padding: 15,
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  buttonLast: {
    padding: 15,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  button: {
    padding: 15,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
  containerElement: {
    width: 10,
  },
});

class AccountScreen extends React.Component<any> {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bodyContainer}>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity testID='profileBtn' style={styles.buttonFirst}
              onPress={() => this.props.navigation.navigate('Profile')}>
              <Text>My Profile</Text>
              <Icon library='AntDesign' name='caretright' />
            </TouchableOpacity>
            <TouchableOpacity testID='loginSecurityBtn' style={styles.button}
              onPress={() => this.props.navigation.navigate('Security')}>
              <Text>Login & Security</Text>
              <Icon library='AntDesign' name='caretright' />
            </TouchableOpacity>
            <TouchableOpacity testID='paymentBtn' style={styles.button} onPress={() => undefined}>
              <Text>Payments</Text>
              <Icon library='AntDesign' name='caretright' />
            </TouchableOpacity>
            <TouchableOpacity testID='ratingsBtn' style={styles.button}
              onPress={() => this.props.navigation.navigate('Ratings')}>
              <Text>Ratings</Text>
              <Icon library='AntDesign' name='caretright' />
            </TouchableOpacity>
            <TouchableOpacity testID='addressBtn' style={styles.buttonLast} onPress={() => undefined}>
              <Text>Your Addresses</Text>
              <Icon library='AntDesign' name='caretright' />
            </TouchableOpacity>
            <View style={{
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              margin: 10,
            }}>
              <Button
                testID='signOutBtn'
                onPress={async () => b2cClient.signOut()}
                width={100}
                shape='circle'
                padding={0}
              >
            Sign out
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default AccountScreen;
