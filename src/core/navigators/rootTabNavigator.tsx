import React from 'react';
import { colors } from 'fixit-common-ui';
import ProfileStackNavigator from '../../features/userprofile/navigators/profileStackNavigator';
import HomeStackNavigator from './homeStackNavigator';
import FixesStackNavigator from '../../features/userfixes/navigators/fixesStackNavigator';
import ChatStackNavigator from '../../features/chat/navigators/chatStackNavigator';
import { routes, icons } from '../constants';
import Tab from './Tab';
import tabScreen from './tabScreen';

const RootTabNavigator = (): JSX.Element => {
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
    StackNavigator: HomeStackNavigator,
  };
  const profile = {
    name: routes.profile,
    iconName: icons.home,
    StackNavigator: ProfileStackNavigator,
  };
  const fixes = {
    name: routes.fixes,
    iconName: icons.hammer,
    StackNavigator: FixesStackNavigator,
  };
  const chat = {
    name: routes.chat,
    iconName: icons.comment,
    StackNavigator: ChatStackNavigator,
  };
  return (
    <Tab.Navigator
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
