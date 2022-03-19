import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { colors, Icon } from 'fixit-common-ui';
import { View } from 'react-native';
import Tab from './Tab';
import animators from '../../common/animators';

const Highlights = (): JSX.Element => (
  <>
    <View
      style={{
        width: 7,
        height: 1,
        backgroundColor: colors.primary,
        position: 'absolute',
        top: -5,
        left: -15,
      }}
    />
    <View
      style={{
        width: 1,
        height: 7,
        backgroundColor: colors.primary,
        position: 'absolute',
        top: -5,
        left: -15,
      }}
    />
    <View
      style={{
        width: 7,
        height: 1,
        backgroundColor: colors.primary,
        position: 'absolute',
        bottom: -28,
        right: -18,
      }}
    />
    <View
      style={{
        width: 1,
        height: 7,
        backgroundColor: colors.primary,
        position: 'absolute',
        bottom: -28,
        right: -18,
      }}
    />
  </>
);

const tabBarIcon = (focused: boolean, name: string): JSX.Element => {
  const iconColor = focused ? 'accent' : 'primary';
  const isFocused = useIsFocused();
  return (
    <>
      <animators.BottomTabHighlightsAnimator focused={isFocused}>
        <Highlights />
      </animators.BottomTabHighlightsAnimator>
      <animators.BottomTabIconAnimator focused={isFocused}>
        <Icon library="FontAwesome5" name={name} color={iconColor} size={18} style={{ marginBottom: -10 }} />
      </animators.BottomTabIconAnimator>
    </>
  );
};

const tabScreen = (props: { name: string; iconName: string; StackNavigator: any }): any => (
  <Tab.Screen
    name={props.name}
    options={{
      tabBarIcon: ({ focused }) => tabBarIcon(focused, props.iconName),
    }}>
    {props.StackNavigator}
  </Tab.Screen>
);

export default tabScreen;
