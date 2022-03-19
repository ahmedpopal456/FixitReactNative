import React, { FunctionComponent, useEffect } from 'react';
import { colors } from 'fixit-common-ui';
import { NotificationsService, RatingsService, store, StoreState, useSelector } from '../../store';
import ProfileStackNavigator from '../../features/userprofile/navigators/profileStackNavigator';
import HomeStackNavigator from './homeStackNavigator';
import FixesStackNavigator from '../../features/userfixes/navigators/fixesStackNavigator';
import ChatStackNavigator from '../../features/chat/navigators/chatStackNavigator';
import { routes, icons } from '../constants';
import Tab from './Tab';
import tabScreen from './tabScreen';
import config from '../config/appConfig';
import { Dimensions } from 'react-native';

const ratingsService = new RatingsService(config, store);
const notificationService = new NotificationsService(config, store);

const RootTabNavigator: FunctionComponent = () => {
  const userRatingState = useSelector((storeState: StoreState) => storeState.ratings);
  const notifications = useSelector((storeState: StoreState) => storeState.notifications.notifications);
  const user = useSelector((storeState: StoreState) => storeState.user);

  //TODO: Add paging to screen
  const pageSize = 100000;

  useEffect(() => {
    const initialCalls = async () => {
      await ratingsService.getUserRatingsAverage(user.userId as string);
      await notificationService.getNotificationsPaginated(user.userId as string, 1, pageSize);
    };
    initialCalls();
  }, [user]);

  const tabBarOptions = {
    activeTintColor: colors.accent,
    inactiveTintColor: colors.primary,
    keyboardHidesTabBar: true,
    style: {
      paddingBottom: (Dimensions.get('window').height * 3) / 100,
      height: (Dimensions.get('window').height * 12) / 100,
    },
  };
  const home = {
    name: routes.home,
    iconName: icons.home,
    StackNavigator: (componentProps: any) => (
      <HomeStackNavigator
        {...componentProps}
        otherProp={{
          averageRating: userRatingState.averageRating,
          notificationCount: notifications.unreadNotifications,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress),
          ratingCount: userRatingState.ratings.length,
          profilePictureUrl: user.profilePictureUrl,
          userId: user.userId,
        }}
      />
    ),
  };
  const profile = {
    name: routes.profile,
    iconName: icons.user,
    StackNavigator: (componentProps: any) => (
      <ProfileStackNavigator
        {...componentProps}
        otherProp={{
          averageRating: userRatingState.averageRating,
          notificationCount: notifications.unreadNotifications,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress),
          ratingCount: userRatingState.ratings.length,
          profilePictureUrl: user.profilePictureUrl,
          userId: user.userId,
        }}
      />
    ),
  };
  const fixes = {
    name: routes.fixes,
    iconName: icons.hammer,
    StackNavigator: (componentProps: any) => (
      <FixesStackNavigator
        {...componentProps}
        otherProp={{
          averageRating: userRatingState.averageRating,
          notificationCount: notifications.unreadNotifications,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress),
          ratingCount: userRatingState.ratings.length,
          profilePictureUrl: user.profilePictureUrl,
          userId: user.userId,
        }}
      />
    ),
  };
  const chat = {
    name: routes.chat,
    iconName: icons.comment,
    StackNavigator: (componentProps: any) => (
      <ChatStackNavigator
        {...componentProps}
        otherProp={{
          averageRating: userRatingState.averageRating,
          notificationCount: notifications.unreadNotifications,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress),
          ratingCount: userRatingState.ratings.length,
          profilePictureUrl: user.profilePictureUrl,
          userId: user.userId,
        }}
      />
    ),
  };
  return (
    <Tab.Navigator tabBarOptions={tabBarOptions} initialRouteName={routes.home}>
      {tabScreen(home)}
      {tabScreen(profile)}
      {tabScreen(fixes)}
      {tabScreen(chat)}
    </Tab.Navigator>
  );
};

export default RootTabNavigator;
