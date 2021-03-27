import React from 'react';
import {
  SafeAreaView, Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import {
  PersistentState, connect,
} from 'fixit-common-data-store';

class HomeScreen extends React.Component<any> {
  renderScreen() {
    if (this.props.role === 0) { // client view
      return (
        <View style={{ justifyContent: 'center' }}>
          <Text>Home client</Text>
        </View>
      );
    }
    if (this.props.role === 1) { // craftsman view
      return (
        <View style={{ justifyContent: 'center' }}>
          <Text>Home craftsman</Text>
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
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default connect(mapStateToProps)(HomeScreen);
