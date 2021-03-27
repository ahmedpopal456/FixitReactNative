import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../screens/accountScreen';
import ProfileScreen from '../screens/profileScreen';
import SecurityScreen from '../screens/securityScreen';
import RatingsScreen from '../screens/ratingsScreen';
import RatingItemScreen from '../screens/ratingItemScreen';
import NotificationsScreen from '../screens/notificationsScreen';
import Test1 from '../screens/test1';
import Test2 from '../screens/test2';
import Test3 from '../screens/test3';

const Stack = createStackNavigator();

function ProfileStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Ratings" component={RatingsScreen} />
      <Stack.Screen name="RatingItem" component={RatingItemScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Test1" component={Test1} />
      <Stack.Screen name="Test2" component={Test2} />
      <Stack.Screen name="Test3" component={Test3} />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;
