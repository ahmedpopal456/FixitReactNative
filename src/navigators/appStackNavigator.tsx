import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'fixit-common-data-store';
import RegisterScreen from '../screens/registerScreen';
import NotificationSetup from '../Setup';

const Stack = createStackNavigator();

class AppStackNavigator extends React.Component<{isAuthenticated: boolean}> {
  render(): JSX.Element {
    return (
      <Stack.Navigator headerMode="none">
        {this.props.isAuthenticated ? (
          <Stack.Screen name="Main" component={NotificationSetup} />
        ) : (
          <Stack.Screen name="Auth" component={RegisterScreen} />
        )}
      </Stack.Navigator>
    );
  }
}

const mapStateToProps = (state: {user: {isAuthenticated: boolean}}) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(AppStackNavigator);
