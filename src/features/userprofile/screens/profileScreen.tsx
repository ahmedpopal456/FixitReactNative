import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Text, View, StyleSheet, Image, ScrollView, Dimensions, TextInput,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store, ProfileService, ConfigFactory, StoreState, useSelector,
} from 'fixit-common-data-store';
import useAsyncEffect from 'use-async-effect';
import { Avatar } from 'react-native-elements';

interface ProfileScreenState {
  userAddress: string | undefined
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height - 95,
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  topContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  bodyContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    padding: 10,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    padding: 5,
  },
  title: {
    fontSize: 20,
  },
  valueContainer: {
    width: 300,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexDirection: 'column',
    width: '90%',
    flexBasis: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchIcon: {
    padding: 10,
  },
  formField: {
    width: '100%',
    borderWidth: 1,
    flexShrink: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: 'black',
    marginBottom: 10,
  },
  text: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  image: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

const initialState = {
  userAddress: store.getState().profile?.address?.address?.formattedAddress,
};

const ProfileScreen : FunctionComponent<any> = (props) => {
  const [state, setState] = useState<ProfileScreenState>(initialState);
  const user = useSelector((storeState: StoreState) => storeState.user);

  useAsyncEffect(async () => {
    setState({
      userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress)?.address?.formattedAddress,
    });
  }, [user]);

  const render = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Button onPress={() => props.navigation.goBack()} color='transparent'>
          <Icon library='AntDesign' name='back' size={30} />
        </Button>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={styles.bodyContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}>
          <Avatar
            size="xlarge"
            rounded
            icon={{ name: 'user', color: '#FFD14A', type: 'font-awesome' }}
          />
          <Text style={styles.text}>Name</Text>
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            style={styles.formField}
            value={`${user.firstName} ${user.lastName}`}
            placeholder="N/A"
            accessible={false}
          />
          <Text style={styles.text}>Email</Text>
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            style={styles.formField}
            value={user.userPrincipalName}
            placeholder="N/A"
            accessible={false}
          />
          <Text style={styles.text}>Location</Text>
          <View style={styles.searchSection}>
            <TextInput
              style={styles.formField}
              defaultValue={state.userAddress}
              allowFontScaling={true}
              maxLength={30}
              onTouchEnd={() => props.navigation.navigate('AddressSelector')}
            />
            <Icon style={styles.searchIcon} library="FontAwesome5" name="map-marker-alt" color={'dark'} size={20}/>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
  return render();
};

export default ProfileScreen;
