import React, { FunctionComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddressSelectorScreen from '../../../screens/address/addressSelectorScreen';
import AddressEditionScreen from '../../../screens/address/addressEditionScreen';
import Header from '../../../components/headers/header';
import AccountScreen from '../screens/accountScreen';
import ProfileScreen from '../screens/profileScreen';
import SecurityScreen from '../screens/securityScreen';
import RatingsScreen from '../screens/ratingsScreen';
import RatingItemScreen from '../screens/ratingItemScreen';
import NotificationsScreen from '../../notifications/screens/notificationsScreen';
import { SupportedOSConstants } from '../../../core/constants/SupportedOSConstants';
import { Platform } from 'react-native';

const Stack = createStackNavigator();

const ProfileStackNavigator: FunctionComponent<any> = (props) => (
  <Stack.Navigator
    headerMode="screen"
    screenOptions={{
      headerShown: false,
      header: ({ navigation }) => (
        <Header
          height={Number(SupportedOSConstants.get(Platform.OS)?.get('height'))}
          notificationsBadgeCount={props.otherProp.notificationCount}
          userRatings={props.otherProp.averageRating}
          navigation={navigation}
          userFirstName={props.otherProp.userFirstName}
          userLastName={props.otherProp.userLastName}
          ratingCount={props.otherProp.ratingCount}
          userAddress={props.otherProp.userAddress}></Header>
      ),
    }}>
    <Stack.Screen
      name="Account"
      component={AccountScreen}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Security" component={SecurityScreen} />
    <Stack.Screen name="Ratings" component={RatingsScreen} />
    <Stack.Screen name="RatingItem" component={RatingItemScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="AddressSelector" component={AddressSelectorScreen} />
    <Stack.Screen name="AddressDetails" component={AddressEditionScreen} />
  </Stack.Navigator>
);

export default ProfileStackNavigator;
