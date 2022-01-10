import React, { FunctionComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FixesScreen from '../screens/fixesScreen';
import NotificationsScreen from '../../notifications/screens/notificationsScreen';
import Header from '../../../components/headers/header';

const Stack = createStackNavigator();

const FixesStackNavigator: FunctionComponent<any> = (props) => (
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
          ratingCount={props.otherProp.ratingCount}
          userAddress={props.otherProp.userAddress}></Header>),
    }}>
    <Stack.Screen
      name="Fixes"
      component={FixesScreen}
      options={{
        headerShown: true,
      }}/>
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}/>
  </Stack.Navigator>
);

export default FixesStackNavigator;
