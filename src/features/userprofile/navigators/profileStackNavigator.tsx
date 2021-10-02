import React, { FunctionComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../../../components/headers/header';
import AccountScreen from '../screens/accountScreen';
import ProfileScreen from '../screens/profileScreen';
import SecurityScreen from '../screens/securityScreen';
import RatingsScreen from '../screens/ratingsScreen';
import RatingItemScreen from '../screens/ratingItemScreen';
import NotificationsScreen from '../../notifications/screens/notificationsScreen';

const Stack = createStackNavigator();

const ProfileStackNavigator: FunctionComponent<any> = (props) => (
  <Stack.Navigator
    headerMode='screen'
    screenOptions={{
      headerShown: false,
      header: ({ navigation }) => (
        <Header
          notificationsBadgeCount={props.otherProp.notificationCount}
          userRatings={props.otherProp.averageRating}
          navigation={navigation}
          userFirstName={props.otherProp.userFirstName}
          userLastName={props.otherProp.userLastName}
          ratingCount={props.otherProp.ratingCount}></Header>),
    }}>
    <Stack.Screen
      name="Account"
      component={AccountScreen}
      options={{
        headerShown: true,
      }} />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}/>
    <Stack.Screen
      name="Security"
      component={SecurityScreen}/>
    <Stack.Screen
      name="Ratings"
      component={RatingsScreen}/>
    <Stack.Screen
      name="RatingItem"
      component={RatingItemScreen} />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen} />
  </Stack.Navigator>
);

export default ProfileStackNavigator;
