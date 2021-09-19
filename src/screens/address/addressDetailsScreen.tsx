/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, StyleSheet, View, ScrollView, RefreshControl, SafeAreaView, TextInput,
} from 'react-native';
import {
  AddressService,
  ConfigFactory,
  store,
  StoreState,
  UserService,
  useSelector,
} from 'fixit-common-data-store';
import {
  Button, colors, Icon,
} from 'fixit-common-ui';
import useAsyncEffect from 'use-async-effect';
import Toast from 'react-native-toast-message';
import MapView from 'react-native-maps';

const addressService = new AddressService(new ConfigFactory(), store);
const userService = new UserService(new ConfigFactory(), store);

const mapsStyles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#FFD14A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footer: {
    flexBasis: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    zIndex: 1,
  },
  addressSelector: {
    alignItems: 'center',
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
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
    marginLeft: 10,
    textAlign: 'left',
    color: colors.dark,
  },
  recentLocations: {
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1,
    flexBasis: '35%',
    flexShrink: 1,
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

function AddressDetailsScreen({ route }) : JSX.Element {
  const navigation = useNavigation();
  const selectedAddressStoreState = useSelector((storeState: StoreState) => storeState.address.selectedAddress);
  const user = useSelector((storeState: StoreState) => storeState.user);

  const addressItem = route.params.address;
  const [refreshState, setRefreshState] = useState<boolean>(false);
  const [aptSuiteFloor, setAptSuiteFloor] = useState<string>('');
  const [label, setLabel] = useState<string>('');

  useAsyncEffect(() => {
    addressService.getAddressById(addressItem.placeId);
  }, []);

  const onRefresh = async () => {
    setRefreshState(true);
    setRefreshState(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button onPress={() => {
          navigation.goBack();
        }} color='accent'>
          <Icon library='AntDesign' name='back' />
        </Button>
        <Text style={styles.title}>Address Details</Text>
      </View>
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
      <View style={styles.recentLocations}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshState}
              onRefresh={onRefresh}
              colors={[colors.orange]}/>
          }
          showsVerticalScrollIndicator={true}>
          <Text style={{ fontSize: 20, color: 'black' }}>{selectedAddressStoreState.address.formattedAddress}</Text>
          <View style={styles.searchSection}>
            <TextInput
              style={styles.input}
              defaultValue=""
              allowFontScaling={true}
              maxLength={30}
              onChangeText={(text) => setAptSuiteFloor(text)}
            />
          </View>
          <Text style={{ fontSize: 12, color: 'grey' }}>Apt / Suite / Floor</Text>
          <View style={styles.searchSection}>
            <TextInput
              style={styles.input}
              defaultValue=""
              allowFontScaling={true}
              maxLength={30}
              onChangeText={(text) => setLabel(text)}
            />
          </View>
          <Text style={{ fontSize: 12, color: 'grey' }}>Address Label</Text>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button
          onPress={() => {
            userService.addUserAddresses(user.userId as string,
              {
                address: selectedAddressStoreState.address,
                aptSuiteFloor,
                label,
              });
            navigation.navigate('HomeScreen');
          }}
          color='dark'
          style={{ width: '90%' }}>
          <Text style={{ fontSize: 18, color: colors.accent }}>Save and continue</Text>
        </Button>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
}

export default AddressDetailsScreen;
