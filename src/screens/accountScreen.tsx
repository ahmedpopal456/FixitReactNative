import React from 'react';
import {
  SafeAreaView, Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Icon } from 'fixit-common-ui';
import {
  store, ProfileService, RatingsService, ConfigFactory,
} from 'fixit-common-data-store';

const profileService = new ProfileService(new ConfigFactory());
const ratingsService = new RatingsService(new ConfigFactory());

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  imageContainer: {
    height: 150,
    paddingTop: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  ratingContainer: {
    zIndex: 1,
    position: 'absolute',
    top: -15,
    width: 100,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '80%',
  },
  buttonFirst: {
    padding: 10,
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  buttonLast: {
    padding: 10,
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
    padding: 10,
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
    backgroundColor: 'tomato', // remove this later
  },
});

export default class AccountScreen extends React.Component
<any, {
  firstName: string,
  lastName: string,
  address: Record<string, any>,
  profilePictureUrl: string,
  averageRating: number
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      firstName: store.getState().profile.profile.firstName,
      lastName: store.getState().profile.profile.lastName,
      address: store.getState().profile.profile.address,
      profilePictureUrl: store.getState().profile.profile.profilePictureUrl,
      averageRating: store.getState().ratings.ratings.averageRating,
    };
  }

  // TODO: Get userId from the store
  async componentDidMount() {
    const responseProfile = await profileService.getUserProfile('858e2783-b80b-48e6-b895-3c88bf0808a9');
    const responseRatings = await ratingsService.getUserRatingsAverage('858e2783-b80b-48e6-b895-3c88bf0808a9');
    this.setState({
      firstName: responseProfile.firstName,
      lastName: responseProfile.lastName,
      address: responseProfile.address,
      profilePictureUrl: responseProfile.profilePictureUrl,
      averageRating: responseRatings.ratings.averageRating,
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={styles.circle}>
          </View>
          <Text>{this.state.firstName} {this.state.lastName}</Text>
        </View>

        <View style={styles.bodyContainer}>
          <View style={styles.ratingContainer}>
            <Text>{this.state.averageRating}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonFirst} onPress={() => this.props.navigation.navigate('Profile')}>
              <Text>My Profile</Text>
              <Icon library='AntDesign' name='caretright' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Security')}>
              <Text>Login & Security</Text>
              <Icon library='AntDesign' name='caretright' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => undefined}>
              <Text>Payments</Text>
              <Icon library='AntDesign' name='caretright' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Ratings')}>
              <Text>Ratings</Text>
              <Icon library='AntDesign' name='caretright' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonLast} onPress={() => undefined}>
              <Text>Your Addresses</Text>
              <Icon library='AntDesign' name='caretright' />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
