import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterPage from '../screens/registerPage';
import BottomBarNavigator from './bottomBarNavigator';

const Stack = createStackNavigator();

function AppStackNavigator() : JSX.Element {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name="Auth" component={RegisterPage} />
      <Stack.Screen name="Main" component={BottomBarNavigator} />
    </Stack.Navigator>
  );
}

export default AppStackNavigator;
