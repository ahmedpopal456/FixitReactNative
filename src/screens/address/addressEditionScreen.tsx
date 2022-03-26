/* eslint-disable no-nested-ternary */
import React, { useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TextInput,
  Dimensions,
  Platform,
  findNodeHandle,
  Button,
} from 'react-native';
import { store, StoreState, UserService, useSelector, UserAddressModel } from '../../store';
import { colors, Icon, Button as FixitButton } from 'fixit-common-ui';
import Toast from 'react-native-toast-message';
import MapView from 'react-native-maps';
import { AddressEditionScreenProps } from './addressEditionScreenProps';
import config from '../../core/config/appConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const userService = new UserService(config, store);
const mapsStyles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  header: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 50 : 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#FFD14A',
  },
  footer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingBottom: 10,
  },
  addressSelector: {
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    height: 300,
  },
  searchSection: {
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#EEEEEE',
  },
  searchIcon: {
    padding: 10,
    marginLeft: 10,
  },
  input: {
    width: '100%',
    height: 50,
    marginLeft: 10,
    textAlign: 'left',
    color: colors.dark,
  },
  addressDetails: {
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1,
    flex: 4,
    backgroundColor: 'white',
    padding: 15,
  },
  spinner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 30,
  },
});

// TODO: Move parts of this screen to components
function AddressEditionScreen({ route }: { route: any }): JSX.Element {
  const user = useSelector((storeState: StoreState) => storeState.user);
  const props = route.params as AddressEditionScreenProps;
  let scrollRef = useRef<KeyboardAwareScrollView>(null);
  const [refreshState, setRefreshState] = useState<boolean>(false);
  const [aptSuiteFloor, setAptSuiteFloor] = useState<string>('');
  const [label, setLabel] = useState<string>('');

  const onRefresh = async () => {
    setRefreshState(true);
    setRefreshState(false);
  };

  return (
    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: colors.accent }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <FixitButton
            onPress={() => {
              props.navigation.goBack();
            }}
            color="accent">
            <Icon library="AntDesign" name="back" />
          </FixitButton>
        </View>
        <View style={{ alignSelf: 'center', flex: 4, justifyContent: 'flex-start' }}>
          <Text style={styles.title}>Address Details</Text>
        </View>
      </View>
      <View style={{ flex: 9, backgroundColor: colors.white }}>
        <KeyboardAwareScrollView
          refreshControl={<RefreshControl refreshing={refreshState} onRefresh={onRefresh} colors={[colors.orange]} />}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === 'ios'}>
          <View style={styles.addressSelector}>
            <MapView
              style={mapsStyles.map}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 20, color: 'black', padding: 5 }}>{props.address.address.formattedAddress}</Text>
            <Text style={{ fontSize: 12, color: 'grey', padding: 5 }}>Apt / Suite / Floor</Text>
            <View style={styles.searchSection}>
              <TextInput
                style={styles.input}
                defaultValue={props.address?.aptSuiteFloor}
                allowFontScaling={true}
                maxLength={30}
                onChangeText={(text) => setAptSuiteFloor(text)}
              />
            </View>
            <Text style={{ fontSize: 12, color: 'grey', padding: 5 }}>Address Label</Text>

            <View style={styles.searchSection}>
              <TextInput
                style={styles.input}
                defaultValue={props.address?.label}
                allowFontScaling={true}
                maxLength={30}
                onChangeText={(text) => setLabel(text)}
              />
            </View>
            {props.IsEdit ? (
              <FixitButton
                onPress={async () => {
                  await userService.removeUserAddresses(user.userId as string, props.address.id);
                  props.navigation.pop();
                }}
                color="red"
                style={{ width: '100%', marginTop: 30 }}>
                <Text style={{ fontSize: 18, color: colors.dark }}>Remove Address</Text>
              </FixitButton>
            ) : (
              <></>
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>
      <View style={styles.footer}>
        <FixitButton
          onPress={async () => {
            const createdUserAddress: UserAddressModel = await userService.addUserAddresses(user.userId as string, {
              address: props.address.address,
              aptSuiteFloor,
              label,
              isCurrentAddress: false,
            });

            await userService.updateUserAddresses(user.userId as string, createdUserAddress.id, {
              ...createdUserAddress,
              isCurrentAddress: true,
            });
            // TODO: Find a better way to go back two screens
            props.navigation.pop(2);
          }}
          color="dark">
          <Text style={{ fontSize: 18, color: colors.accent, height: 25 }}>Save and continue</Text>
        </FixitButton>
      </View>
    </View>
  );
}

export default AddressEditionScreen;
