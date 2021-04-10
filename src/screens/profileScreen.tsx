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
    height: 40,
    paddingLeft: 10,
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

class ProfileScreen extends React.Component
<any, {
  firstName: string,
  lastName: string,
  address: AddressModel,
  profilePictureUrl: string,
  email: string,
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      firstName: store.getState().profile.firstName,
      lastName: store.getState().profile.lastName,
      address: store.getState().profile.address,
      profilePictureUrl: store.getState().profile.profilePictureUrl,
      email: '',
    };
  }

  // TODO: Get userId from the store
  //       Replace userId string with : this.props.userId
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
          <ScrollView keyboardDismissMode='interactive'>
            {this.state.profilePictureUrl
              ? <View style={styles.image}>
                <Image
                  style={styles.image}
                  source={{ uri: this.state.profilePictureUrl }}
                />
              </View>
              : <View style={styles.image}>
                <Text>Image not found</Text>
              </View>
            }

            <View style={styles.infoContainer}>
              <Text style={styles.text}>Name</Text>
              <View style={styles.valueContainer}>
                <Text>{this.state.firstName} {this.state.lastName}</Text>
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Email</Text>
              <View style={styles.valueContainer}>
                <Text>{this.state.email}</Text>
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Location</Text>
              <View style={styles.valueContainer}>
                <Text>{this.state.address.address}</Text>
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
    unseenNotificationsNumber: state.unseenNotificationsNumber,
  };
}

export default connect(mapStateToProps)(ProfileScreen);
