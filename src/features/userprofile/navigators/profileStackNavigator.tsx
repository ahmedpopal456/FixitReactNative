import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../screens/accountScreen';
import ProfileScreen from '../screens/profileScreen';
import SecurityScreen from '../screens/securityScreen';
import RatingsScreen from '../screens/ratingsScreen';
import RatingItemScreen from '../screens/ratingItemScreen';
import NotificationsScreen from '../../../screens/notificationsScreen';

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
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;
