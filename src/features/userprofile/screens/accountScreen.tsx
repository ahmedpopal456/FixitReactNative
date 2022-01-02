import React, { FunctionComponent } from 'react';
import {
  SafeAreaView, Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import NativeAuthService from '../../../core/services/authentication/nativeAuthService';
import { b2cConfig } from '../../../core/config/msalConfig';

const b2cClient = new NativeAuthService(b2cConfig);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  bodyContainer: {
    marginTop: 50,
    backgroundColor: 'white',
    flexDirection: 'column',
    flexGrow: 1,
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

const AccountScreen : FunctionComponent<any> = (props) => {
  const option = (id : string,
    title: string,
    navigateTo: string | undefined,
    action : any,
    style: any) => (<TouchableOpacity testID={id} style={style}
    // eslint-disable-next-line no-nested-ternary
    onPress={() => (navigateTo ? props.navigation.navigate(navigateTo) : action !== null ? action() : null)}>
    <Text>{title}</Text>
    <Icon library='AntDesign' name='caretright' />
  </TouchableOpacity>);

  const render = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={styles.buttonsContainer}>
          {option('profileBtn', 'My Profile', 'Profile', null, styles.buttonFirst)}
          {option('loginSecurityBtn', 'Login & Security', undefined, null, styles.button)}
          {option('paymentBtn', 'Payments', undefined, null, styles.button)}
          {option('ratingsBtn', 'Ratings', 'Ratings', null, styles.button)}
          {option('signOutBtn', 'Sign Out', undefined, async () => b2cClient.signOut(), styles.buttonLast)}
        </View>
      </View>
      <View style={{
        alignItems: 'center',
        alignContent: 'flex-end',
        alignSelf: 'center',
        height: '15%',
      }}>
      </View>
    </SafeAreaView>
  );
  return render();
};

export default AccountScreen;
