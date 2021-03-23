import React from 'react';
import {
  Text, View, StyleSheet, Image, ScrollView, Dimensions,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store, ProfileService, ConfigFactory } from 'fixit-common-data-store';

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

export default class ProfileScreen extends React.Component
<any, {
  firstName: string,
  lastName: string,
  address: Record<string, any>,
  profilePictureUrl: string,
  email: string
}> {
  constructor(props: any) {
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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Button onPress={() => this.props.navigation.goBack()} color='transparent'>
          <Icon library='AntDesign' name='back' size={30} />
        </Button>
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
