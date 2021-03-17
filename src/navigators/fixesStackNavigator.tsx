import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FixesScreen from '../screens/fixesScreen';

const Stack = createStackNavigator();

function FixesStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name="Fixes" component={FixesScreen} />
    </Stack.Navigator>
  );
}

export default FixesStackNavigator;
