/* eslint-disable no-nested-ternary */
import React, { useState, FunctionComponent, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView,
  TextInput, FlatList, ListRenderItem,
} from 'react-native';
import {
  AddressQueryItemModel,
  AddressService,
  ConfigFactory,
  persistentActions,
  store,
  StoreState,
  UserAddressModel,
  UserService,
  useSelector,
} from 'fixit-common-data-store';
import {
  Button, colors, Icon,
} from 'fixit-common-ui';
import useAsyncEffect from 'use-async-effect';
import Toast from 'react-native-toast-message';
import { Divider } from 'react-native-elements';

const addressService = new AddressService(new ConfigFactory(), store);
const userService = new UserService(new ConfigFactory(), store);

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
  addressSelector: {
    flexBasis: '20%',
    flexGrow: 1,
    flexDirection: 'column',
    padding: 10,
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
    textAlign: 'left',
    color: colors.dark,
  },
  savedLocations: {
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1,
    flexBasis: '80%',
    flexShrink: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  spinner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 30,
  },
});

const AddressSelectorScreen: FunctionComponent = () => {
  const navigation = useNavigation();
  const queriedAddressesStoreState = useSelector((storeState: StoreState) => storeState.address.queriedAddresses);
  const user = useSelector((storeState: StoreState) => storeState.user);

  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout>(setTimeout(() => 1000));
  const [refreshState, setRefreshState] = useState<boolean>(false);
  const [queriedAddresses, setQueriedAddressesState] = useState<Array<AddressQueryItemModel>>([]);
  const [textInput, setTextInput] = useState<string>('');

  useAsyncEffect(async () => {
    if (queriedAddressesStoreState.error === null && !queriedAddressesStoreState.isLoading && textInput.length) {
      setQueriedAddressesState(queriedAddressesStoreState.addressQueries);
    }
  }, [queriedAddressesStoreState]);

  useAsyncEffect(async () => {
    await userService.fetchUser(user.userId as string);
    clearTimeout(searchTimer);
  }, []);

  const onRefresh = async () => {
    setRefreshState(true);
    setRefreshState(false);
  };

  const renderAddressItem : ListRenderItem<UserAddressModel> = ({ item }) => {
    const splitAddress = item.address.formattedAddress?.split(',');

    const country = splitAddress.pop();
    const region = splitAddress.pop();
    const address = splitAddress.join();

    return (
      <View style={{
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
      }}>
        <Icon style={{
          marginRight: 15,
          marginTop: 10,
        }}
        library="FontAwesome5" name="map-marker-alt" color={'dark'} size={20}/>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            store.dispatch(
              persistentActions.default.setCurrentFixLocations(item),
            );
            navigation.navigate('HomeScreen', { address: item.address });
          }}
          style={{ width: '100%' }}>
          <Text style= {{ fontSize: 14, fontWeight: 'bold' }}>{address}</Text>
          <Text style= {{ fontSize: 12, color: 'grey' }}>{country?.trim()},{region}</Text>
          <Text style= {{ fontSize: 12, color: 'grey' }}>{item.label}</Text>
          <Divider
            style={{ marginTop: 15 }}
            orientation="horizontal"
          />
        </TouchableOpacity >
      </View>);
  };

  const renderAddressQueryItem : ListRenderItem<AddressQueryItemModel> = ({ item }) => {
    const splitAddress = item.description?.split(',');

    const country = splitAddress.pop();
    const region = splitAddress.pop();
    const address = splitAddress.join();

    return (
      <View style={{
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
      }}>
        <Icon style={{
          marginRight: 15,
          marginTop: 10,
        }}
        library="FontAwesome5" name="map-marker-alt" color={'dark'} size={20}/>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate('AddressDetails', { address: item });
          }}
          style={{ width: '100%' }}>
          <Text style= {{ fontSize: 14, fontWeight: 'bold' }}>{address}</Text>
          <Text style= {{ fontSize: 12, color: 'grey' }}>{country?.trim()},{region}</Text>
          <Divider
            style={{ marginTop: 15 }}
            orientation="horizontal"
          />
        </TouchableOpacity >
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button onPress={() => {
          setQueriedAddressesState([]);
          navigation.goBack();
        }} color='accent'>
          <Icon library='AntDesign' name='back' />
        </Button>
        <Text style={styles.title}>Fix Address</Text>
      </View>
      <View style={styles.addressSelector}>
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} library="FontAwesome5" name="search" color={'dark'} size={20}/>
          <TextInput
            style={styles.input}
            defaultValue=""
            allowFontScaling={true}
            maxLength={30}
            onChangeText={(text) => {
              clearTimeout(searchTimer);
              setSearchTimer(setTimeout(() => {
                setTextInput(text);
                setQueriedAddressesState([]);
                addressService.getAddressBySearch(text);
              }, 500));
            }}
          />
        </View>
        <Text style={{ fontSize: 12, color: 'grey' }}>Enter a new address</Text>
        {queriedAddresses?.length ? <FlatList
          style={{
            marginTop: 20,
            marginLeft: 10,
          }}
          focusable
          contentContainerStyle={{ justifyContent: 'space-evenly' }}
          data={queriedAddresses}
          renderItem={renderAddressQueryItem}
          keyExtractor={(item) => item.placeId}
        /> : <></>}
      </View>
      {!queriedAddresses?.length ? <View style={styles.savedLocations}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshState}
              onRefresh={onRefresh}
              colors={[colors.orange]}/>
          }
          showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 14, fontWeight: '100', color: 'black' }}>Saved locations</Text>
          <FlatList
            style={{
              marginTop: 20,
              marginLeft: 10,
            }}
            focusable
            contentContainerStyle={{ justifyContent: 'space-evenly' }}
            data={user.savedAddresses}
            renderItem={renderAddressItem}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      </View> : <></>}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default AddressSelectorScreen;
