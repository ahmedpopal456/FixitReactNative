import React from 'react';
import {
  Text, View, StyleSheet, Image, ScrollView, Dimensions,
} from 'react-native';
import { Button, Icon, NotificationBell } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store, ProfileService, ConfigFactory, PersistentState, connect,
} from 'fixit-common-data-store';
import { AddressModel } from 'fixit-common-data-store/src/models/profile/profileModel';
import defaultProfilePic from '../../../common/assets/defaultProfileIcon.png';

interface ProfileScreenState {
  firstName: string,
  lastName: string,
  address: AddressModel,
  profilePictureUrl: string
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
    flexGrow: 100,
    alignContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    padding: 5,
  },
  title: {
    paddingLeft: 10,
    paddingBottom: 10,
    fontSize: 20,
  },
  valueContainer: {
    width: 300,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
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

class ProfileScreen extends React.Component<any, ProfileScreenState> {
  constructor(props: any) {
    super(props);
    this.state = {
      firstName: store.getState().profile.firstName,
      lastName: store.getState().profile.lastName,
      address: store.getState().profile.address,
      profilePictureUrl: store.getState().profile.profilePictureUrl,
    };
  }

  async componentDidMount() : Promise<void> {
    const response = await profileService.getUserProfile(this.props.userId);
    this.setState({
      firstName: response.firstName,
      lastName: response.lastName,
      address: response.address,
      profilePictureUrl: response.profilePictureUrl,
    });
  }

  render() : JSX.Element {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Button onPress={() => this.props.navigation.goBack()} color='transparent'>
            <Icon library='AntDesign' name='back' size={30} />
          </Button>
          <NotificationBell
            notifications={this.props.unseenNotificationsNumber}
            // TODO: Extract the navigate string into an enum, same elsewhere
            onPress={() => this.props.navigation.navigate('Notifications')}
          />
        </View>
        <Text style={styles.title}>My Profile</Text>

        <View style={styles.bodyContainer}>
          <ScrollView keyboardDismissMode='interactive'
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            {this.state.profilePictureUrl
              ? <View testID='profilePhoto' style={styles.image}>
                <Image
                  style={styles.image}
                  source={{ uri: this.state.profilePictureUrl }}
                />
              </View>
              : <View testID='profilePhoto' style={styles.image}>
                <Image source={defaultProfilePic} style={styles.image} />
              </View>
            }

            <View style={styles.infoContainer}>
              <Text style={styles.text}>Name</Text>
              <View style={styles.valueContainer}>
                <Text>{this.props.firstName} {this.props.lastName}</Text>
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Email</Text>
              <View style={styles.valueContainer}>
                <Text>{this.props.email}</Text>
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Location</Text>
              <View style={[styles.valueContainer, { flexDirection: 'row' }]}>
                <Text>
                  {this.state.address && this.state.address.address},{' '}
                  {this.state.address && this.state.address.city},{' '}
                  {this.state.address && this.state.address.province},{' '}
                  {this.state.address && this.state.address.postalCode},{' '}
                  {this.state.address && this.state.address.country}{' '}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: PersistentState) {
  return {
    userId: state.user.userId,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    email: state.user.email,
    unseenNotificationsNumber: state.unseenNotificationsNumber,
  };
}

export default connect(mapStateToProps)(ProfileScreen);
