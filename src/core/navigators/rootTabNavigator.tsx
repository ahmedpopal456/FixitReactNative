import React, { FunctionComponent, useEffect } from 'react';
import { colors } from 'fixit-common-ui';
import {
  ConfigFactory, RatingsService, store, StoreState, useSelector,
} from 'fixit-common-data-store';
import ProfileStackNavigator from '../../features/userprofile/navigators/profileStackNavigator';
import HomeStackNavigator from './homeStackNavigator';
import FixesStackNavigator from '../../features/userfixes/navigators/fixesStackNavigator';
import ChatStackNavigator from '../../features/chat/navigators/chatStackNavigator';
import { routes, icons } from '../constants';
import Tab from './Tab';
import tabScreen from './tabScreen';

const ratingsService = new RatingsService(new ConfigFactory(), store);

const RootTabNavigator: FunctionComponent = () => {
  const userRatingState = useSelector((storeState: StoreState) => storeState.ratings);
  const notificationCount = useSelector((storeState:StoreState) => storeState.persist.unseenNotificationsNumber);
  const user = useSelector((storeState:StoreState) => storeState.user);

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
      paddingBottom: 10,
      height: 75,
    },
  };
  const home = {
    name: routes.home,
    iconName: icons.user,
    StackNavigator: (componentProps: any) => <HomeStackNavigator {
      ...componentProps} otherProp={{ averageRating: userRatingState.averageRating, notificationCount }} />,
  };
  const profile = {
    name: routes.profile,
    iconName: icons.home,
    StackNavigator: (componentProps: any) => <ProfileStackNavigator {
      ...componentProps} otherProp={{ averageRating: userRatingState.averageRating, notificationCount }} />,
  };
  const fixes = {
    name: routes.fixes,
    iconName: icons.hammer,
    StackNavigator: (componentProps: any) => <FixesStackNavigator {
      ...componentProps} otherProp={{ averageRating: userRatingState.averageRating, notificationCount }} />,
  };
  const chat = {
    name: routes.chat,
    iconName: icons.comment,
    StackNavigator: (componentProps: any) => <ChatStackNavigator {
      ...componentProps} otherProp={{ averageRating: userRatingState.averageRating, notificationCount }} />,
  };
  return (
    <Tab.Navigator
      lazy={true}
      tabBarOptions={tabBarOptions}
      initialRouteName={routes.home}>
      {tabScreen(home)}
      {tabScreen(profile)}
      {tabScreen(fixes)}
      {tabScreen(chat)}
    </Tab.Navigator>
  );
};

export default RootTabNavigator;
