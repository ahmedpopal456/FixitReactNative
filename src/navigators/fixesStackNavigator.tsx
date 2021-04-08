import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FixesScreen from '../screens/fixesScreen';
import FixOverviewScreen from '../screens/fixOverviewScreen';
import NotificationsScreen from '../screens/notificationsScreen';
import Test1 from '../screens/test1';
import Test2 from '../screens/test2';
import Test3 from '../screens/test3';

const Stack = createStackNavigator();

function FixesStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name="Fixes" component={FixesScreen} />
      <Stack.Screen name="FixOverview" component={FixOverviewScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Test1" component={Test1} />
      <Stack.Screen name="Test2" component={Test2} />
      <Stack.Screen name="Test3" component={Test3} />
    </Stack.Navigator>
  );
}

export default FixesStackNavigator;
