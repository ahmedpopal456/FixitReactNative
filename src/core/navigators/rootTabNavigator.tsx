import React, { FunctionComponent, useEffect } from 'react';
import { colors } from 'fixit-common-ui';
import { RatingsService, store, StoreState, useSelector } from 'fixit-common-data-store';
import ProfileStackNavigator from '../../features/userprofile/navigators/profileStackNavigator';
import HomeStackNavigator from './homeStackNavigator';
import FixesStackNavigator from '../../features/userfixes/navigators/fixesStackNavigator';
import ChatStackNavigator from '../../features/chat/navigators/chatStackNavigator';
import { routes, icons } from '../constants';
import Tab from './Tab';
import tabScreen from './tabScreen';
import config from '../config/appConfig';

const ratingsService = new RatingsService(config, store);

const RootTabNavigator: FunctionComponent = () => {
  const userRatingState = useSelector((storeState: StoreState) => storeState.ratings);
  const notificationCount = useSelector((storeState: StoreState) => storeState.persist.unseenNotificationsNumber);
  const user = useSelector((storeState: StoreState) => storeState.user);

  useEffect(() => {
    const fetchRatings = async () => {
      await ratingsService.getUserRatingsAverage(user.userId as string);
    };
    fetchRatings();
  }, []);

  const tabBarOptions = {
    activeTintColor: colors.accent,
    inactiveTintColor: colors.primary,
    keyboardHidesTabBar: true,
    style: {
      paddingBottom: 30,
      height: 100,
    },
  };
  const home = {
    name: routes.home,
    iconName: icons.user,
    StackNavigator: (componentProps: any) => (
      <HomeStackNavigator
        {...componentProps}
        otherProp={{
          averageRating: userRatingState.averageRating,
          notificationCount,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress),
          ratingCount: userRatingState.ratings.length,
        }}
      />
    ),
  };
  const profile = {
    name: routes.profile,
    iconName: icons.home,
    StackNavigator: (componentProps: any) => (
      <ProfileStackNavigator
        {...componentProps}
        otherProp={{
          averageRating: userRatingState.averageRating,
          notificationCount,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress),
          ratingCount: userRatingState.ratings.length,
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
          notificationCount,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress),
          ratingCount: userRatingState.ratings.length,
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
          notificationCount,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress),
          ratingCount: userRatingState.ratings.length,
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
