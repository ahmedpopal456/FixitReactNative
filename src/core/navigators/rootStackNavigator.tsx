import React, { FunctionComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { StoreState, useSelector } from 'fixit-common-data-store';
import RegisterScreen from '../../features/onboarding/screens/registerScreen';
import RootTabNavigator from './rootTabNavigator';

const Stack = createStackNavigator();

const RootStackNavigator: FunctionComponent = () => {
  const user = useSelector((persistState: StoreState) => persistState.user);
  const render = (): JSX.Element => (
    <Stack.Navigator headerMode="none">
      {user.isAuthenticated ? (
        <Stack.Screen name="Main" component={RootTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={RegisterScreen} />
      )}
    </Stack.Navigator>
  );
  return render();
};

export default RootStackNavigator;
