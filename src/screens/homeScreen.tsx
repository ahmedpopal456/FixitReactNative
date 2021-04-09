import React from 'react';
import {
  Text, View,
} from 'react-native';
import {
  PersistentState, connect,
} from 'fixit-common-data-store';
import { Button } from 'fixit-common-ui';
import UserRoles from '../models/users/userRolesEnum';

class HomeScreen extends React.Component<any> {
  renderScreen() {
    if (this.props.role === UserRoles.CLIENT) {
      return (
        <View style={{ justifyContent: 'center' }}>
          <Text>Home client</Text>
          {/* TODO: Extract the navigate string into an enum, same elsewhere */}
          <Button onPress={() => this.props.navigation.navigate('SearchResultsScreen')}>Search</Button>
        </View>
      );
    }
    if (this.props.role === UserRoles.CRAFTSMAN) {
      return (
        <View style={{ justifyContent: 'center' }}>
          <Text>Home craftsman</Text>
          <Button onPress={() => this.props.navigation.navigate('SearchResultsScreen')}>Search</Button>
        </View>
      );
    }
    return null;
  }

  render = () => this.renderScreen();
}

function mapStateToProps(state: PersistentState) {
  return {
    userId: state.user.userId,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    role: state.user.role,
    unseenNotificationsNumber: state.unseenNotificationsNumber,
    status: state.user.status,
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default connect(mapStateToProps)(HomeScreen);
