import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FixesScreen from '../screens/fixesScreen';
import FixOverviewScreen from '../screens/fixOverviewScreen';
import NotificationsScreen from '../../../screens/notificationsScreen';

const Stack = createStackNavigator();

function FixesStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name="Fixes" component={FixesScreen} />
      <Stack.Screen name="FixOverview" component={FixOverviewScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

export default FixesStackNavigator;
