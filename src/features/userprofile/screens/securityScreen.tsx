import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Text, View, StyleSheet, TextInput, ScrollView, Dimensions,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store, ProfileService, ConfigFactory,
  connect, StoreState, useSelector,
} from 'fixit-common-data-store';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useAsyncEffect from 'use-async-effect';
import Toast from 'react-native-toast-message';

interface SecurityScreenState {
  firstName: string,
  lastName: string,
  address: any,
  profilePictureUrl: string,
  availability: any,
}

const profileService = new ProfileService(new ConfigFactory(), store);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 95,
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  scrollViewContent: {
    flexDirection: 'column',
    width: '100%',
    flexBasis: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  infoContainer: {
    padding: 5,
  },
  nameContainer: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
  },
  nameInputContainer: {
    width: 140,
    height: 40,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    textAlignVertical: 'center',
  },
  input: {
    width: 300,
    height: 40,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    textAlignVertical: 'center',
  },
  text: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },

});

const initialState = {
  firstName: store.getState().profile.firstName,
  lastName: store.getState().profile.lastName,
  address: store.getState().profile.address,
  profilePictureUrl: store.getState().profile.profilePictureUrl,
  availability: {},
};

const SecurityScreen : FunctionComponent<any> = (props) => {
  const [securityScreenState, setSecurityScreenState] = useState<SecurityScreenState>(initialState);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const user = useSelector((storeState: StoreState) => storeState.user);
  const userProfile = useSelector((storeState: StoreState) => storeState.profile);

  useAsyncEffect(async () => {
    await profileService.getUserProfile(user.userId as string);
  }, []);

  useEffect(() => {
    setSecurityScreenState({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      address: userProfile.address,
      profilePictureUrl: userProfile.profilePictureUrl,
      availability: userProfile.availability,
    });

    if (!userProfile.isLoading && isUpdating) {
      // eslint-disable-next-line no-unused-expressions
      userProfile.error === null
        ? Toast.show({
          type: 'success',
          text1: 'Update Successful',
        })
        : Toast.show({
          type: 'error',
          text1: 'Update Failed',
        });
      setIsUpdating(false);
    }
  }, [userProfile]);

  async function updateRequest() {
    setIsUpdating(true);
    await profileService.updateUserProfile(user.userId as string,
      {
        firstName: securityScreenState.firstName,
        lastName: securityScreenState.lastName,
        address: securityScreenState.address,
        availability: securityScreenState.availability,
        profilePictureUrl: securityScreenState.profilePictureUrl,
      });
  }

  function renderOption(title: string, id: string, onChange:any, value: any) {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.text}>{title}</Text>
        <TextInput
          style={styles.input}
          testID={id}
          onChangeText={(item :string) => onChange(item)}
          value={value} />
      </View>);
  }

  function render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Button onPress={() => props.navigation.goBack()} color='transparent'>
            <Icon library='AntDesign' name='back' size={30} />
          </Button>
          <Text style={styles.title}>Login & Security</Text>
          <Button
            onPress={() => updateRequest()}
            color='transparent'
            style={{ marginLeft: 'auto' }}>
            <Icon
              library='MaterialIcons'
              name='save-alt'
              size={50} />
          </Button>
        </View>
        <View style={styles.bodyContainer}>
          <ScrollView
            keyboardDismissMode='interactive'
            contentContainerStyle={styles.scrollViewContent}>
            {renderOption(
              'Phone Number',
              'securityPhoneInput',
              (phone: string) => setSecurityScreenState({
                ...securityScreenState,
                address: {
                  ...securityScreenState.address,
                  phoneNumber: phone,
                },
              }),
              securityScreenState.address && securityScreenState.address.phoneNumber,
            )}
            {renderOption(
              'Street',
              'securityStreetInput',
              (address: string) => setSecurityScreenState({
                ...securityScreenState,
                address: {
                  ...securityScreenState.address,
                  address,
                },
              }),
              securityScreenState.address && securityScreenState.address.address,
            )}
            {renderOption(
              'City',
              'securityCityInput',
              (city: string) => setSecurityScreenState({
                ...securityScreenState,
                address: {
                  ...securityScreenState.address,
                  city,
                },
              }),
              securityScreenState.address && securityScreenState.address.city,
            )}
            {renderOption(
              'Province',
              'securityProvinceInput',
              (province: string) => setSecurityScreenState({
                ...securityScreenState,
                address: {
                  ...securityScreenState.address,
                  province,
                },
              }),
              securityScreenState.address && securityScreenState.address.province,
            )}
            {renderOption(
              'Postal Code',
              'securityPostalCodeInput',
              (postalCode: string) => setSecurityScreenState({
                ...securityScreenState,
                address: {
                  ...securityScreenState.address,
                  postalCode,
                },
              }),
              securityScreenState.address && securityScreenState.address.postalCode,
            )}
            {renderOption(
              'Country',
              'securityCountryInput',
              (country: string) => setSecurityScreenState({
                ...securityScreenState,
                address: {
                  ...securityScreenState.address,
                  country,
                },
              }),
              securityScreenState.address && securityScreenState.address.country,
            )}
          </ScrollView>
        </View>

        <Toast ref={(ref) => Toast.setRef(ref)} />
      </SafeAreaView>
    );
  }
  return render();
};

export default SecurityScreen;
