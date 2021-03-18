import React from 'react';
import {
  Text, View, StyleSheet, TextInput, ScrollView, Dimensions,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store, ProfileService, ConfigFactory } from 'fixit-common-data-store';
import axios from 'axios';

const profileService = new ProfileService(new ConfigFactory());

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 95,
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  bodyContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    padding: 5,
  },
  nameContainer: {
    padding: 5,
    flexDirection: 'row',
  },
  title: {
    paddingLeft: 10,
    paddingBottom: 10,
    fontSize: 20,
  },
  nameInputContainer: {
    width: 150,
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
    borderColor: '#C0C0C0',
    textAlignVertical: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});

class SecurityScreen extends React.Component
<unknown, {
  firstName: string,
  lastName: string,
  address: Record<string, unknown>,
  profilePictureUrl: string,
  email: string
}> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      firstName: store.getState().profile.profile.firstName,
      lastName: store.getState().profile.profile.lastName,
      address: store.getState().profile.profile.address,
      profilePictureUrl: store.getState().profile.profile.profilePictureUrl,
      email: '',
    };
  }

  // TODO: Get userId from the store
  async componentDidMount() {
    const response = await profileService.getUserProfile('858e2783-b80b-48e6-b895-3c88bf0808a9');
    this.setState({
      firstName: response.firstName,
      lastName: response.lastName,
      address: response.address,
      profilePictureUrl: response.profilePictureUrl,
    });
  }

  // TODO: Get userId from the store
  updateRequest() {
    axios.put('https://fixit-dev-ums-api.azurewebsites.net/api/858e2783-b80b-48e6-b895-3c88bf0808a9/account/profile', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address: this.state.address,
      profilePictureUrl: this.state.profilePictureUrl,
    }, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Button onPress={() => this.props.navigation.goBack()} color='accent'>
          <Icon library='AntDesign' name='back' size={30} />
        </Button>
        <Text style={styles.title}>Login & Security</Text>
        <View style={styles.bodyContainer}>
          <ScrollView keyboardDismissMode='interactive'>
            <View style={styles.nameContainer}>
              <View>
                <Text style={styles.text}>First Name</Text>
                <TextInput
                  style={styles.nameInputContainer}
                  onChangeText={(name) => this.setState({ firstName: name })}
                  value={this.state.firstName}
                />
              </View>
              <View>
                <Text style={styles.text}>Last Name</Text>
                <TextInput
                  style={styles.nameInputContainer}
                  onChangeText={(name) => this.setState({ lastName: name })}
                  value={this.state.lastName}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Email</Text>
              <Text style={styles.input}>{this.state.email}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Phone Number</Text>
              <TextInput
                style={styles.input}
                onChangeText={(phone) => this.setState({
                  address: {
                    ...this.state.address,
                    phoneNumber: phone,
                  },
                })}
                value={this.state.address.phoneNumber}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Date of Birth</Text>
              <Text style={styles.input}>Get Date of Birth here</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Location</Text>
              <TextInput
                style={styles.input}
                onChangeText={(location) => this.setState({
                  address: {
                    ...this.state.address,
                    address: location,
                  },
                })}
                value={this.state.address.address}
              />
            </View>
          </ScrollView>
          <Button onPress={() => this.updateRequest()} width={125} style={{ alignSelf: 'center' }} caps>Update</Button>

        </View>
      </SafeAreaView>
    );
  }
}

export default SecurityScreen;
