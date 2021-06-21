import React from 'react';
import {
  Text, View, StyleSheet, TextInput, ScrollView, Dimensions,
} from 'react-native';
import { Button, Icon, NotificationBell } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store, ProfileService, ConfigFactory,
  PersistentState, connect, userActions, StoreState,
} from 'fixit-common-data-store';
import axios from 'axios';

interface SecurityScreenState {
  firstName: string,
  lastName: string,
  address: any,
  profilePictureUrl: string,
  email: string,
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
    justifyContent: 'space-between',
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
    justifyContent: 'space-between',
  },
  title: {
    paddingLeft: 10,
    paddingBottom: 10,
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
    borderColor: '#C0C0C0',
    textAlignVertical: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});

class SecurityScreen extends React.Component<any, SecurityScreenState > {
  constructor(props: any) {
    super(props);
    this.state = {
      firstName: store.getState().profile.firstName,
      lastName: store.getState().profile.lastName,
      address: store.getState().profile.address,
      profilePictureUrl: store.getState().profile.profilePictureUrl,
      email: '',
      availability: {},
    };
  }

  async componentDidMount() : Promise<void> {
    const response = await profileService.getUserProfile(this.props.userId);
    this.setState({
      firstName: response.firstName,
      lastName: response.lastName,
      address: response.address,
      profilePictureUrl: response.profilePictureUrl,
      availability: response.availability,
    });
  }

  updateRequest() : void {
    axios.put(`https://fixit-dev-ums-api.azurewebsites.net/api/${this.props.userId}/account/profile`,
      {
        FirstName: this.state.firstName,
        LastName: this.state.lastName,
        address: this.state.address,
        profilePictureUrl: this.state.profilePictureUrl,
        Availability: this.state.availability,
      }, { headers: { 'Content-Type': 'application/json' } });

    store.dispatch(userActions.setUserInfo({
      userId: this.props.userId,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.props.email,
      role: this.props.role,
      status: this.props.status,
    }));
  }

  render() : JSX.Element {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Button testID='backBtn' onPress={() => this.props.navigation.goBack()} color='transparent'>
            <Icon library='AntDesign' name='back' size={30} />
          </Button>
          <NotificationBell
            notifications={this.props.unseenNotificationsNumber}
            onPress={() => this.props.navigation.navigate('Notifications')}
          />
        </View>
        <Text style={styles.title}>Login & Security</Text>
        <View style={styles.bodyContainer}>
          <ScrollView keyboardDismissMode='interactive'
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
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
              <Text style={styles.input}>{this.props.email}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Phone Number</Text>
              <TextInput
                style={styles.input}
                testID='securityPhoneInput'
                onChangeText={(phone) => this.setState({
                  address: {
                    ...this.state.address,
                    phoneNumber: phone,
                  },
                })}
                value={this.state.address && this.state.address.phoneNumber}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Street</Text>
              <TextInput
                style={styles.input}
                onChangeText={(street) => this.setState({
                  address: {
                    ...this.state.address,
                    address: street,
                  },
                })}
                value={this.state.address && this.state.address.address}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>City</Text>
              <TextInput
                style={styles.input}
                onChangeText={(city) => this.setState({
                  address: {
                    ...this.state.address,
                    city,
                  },
                })}
                value={this.state.address && this.state.address.city}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Province</Text>
              <TextInput
                style={styles.input}
                onChangeText={(province) => this.setState({
                  address: {
                    ...this.state.address,
                    province,
                  },
                })}
                value={this.state.address && this.state.address.province}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Postal Code</Text>
              <TextInput
                style={styles.input}
                onChangeText={(postalCode) => this.setState({
                  address: {
                    ...this.state.address,
                    postalCode,
                  },
                })}
                value={this.state.address && this.state.address.postalCode}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Country</Text>
              <TextInput
                style={styles.input}
                onChangeText={(country) => this.setState({
                  address: {
                    ...this.state.address,
                    country,
                  },
                })}
                value={this.state.address && this.state.address.country}
              />
            </View>
          </ScrollView>
          <Button
            testID='updateBtn'
            onPress={() => this.updateRequest()}
            width={125}
            style={{ alignSelf: 'center' }}
            caps
            shape='circle'
          >
            Update
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: StoreState) {
  return {
    userId: state.user.userId,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    email: state.user.email,
    role: state.user.role,
    status: state.user.status,
    unseenNotificationsNumber: state.persist.unseenNotificationsNumber,
  };
}

export default connect(mapStateToProps)(SecurityScreen);
