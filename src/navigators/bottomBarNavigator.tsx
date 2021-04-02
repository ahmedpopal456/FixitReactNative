import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import { colors, Icon } from 'fixit-common-ui';
import animator from '../animators';
import HomeScreen from '../screens/homeScreen';

// TODO: remove this when real screens are implemented
const DummyScreen = (props: { text: React.ReactNode; }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{props.text}</Text>
  </View>
);

// TODO: move this to CommonUI
function Highlights() {
  return (
    <>
      <View style={{
        width: 7, height: 1, backgroundColor: colors.primary, position: 'absolute', top: -5, left: -15,
      }} />
      <View style={{
        width: 1, height: 7, backgroundColor: colors.primary, position: 'absolute', top: -5, left: -15,
      }} />
      <View style={{
        width: 7, height: 1, backgroundColor: colors.primary, position: 'absolute', bottom: -28, right: -18,
      }} />
      <View style={{
        width: 1, height: 7, backgroundColor: colors.primary, position: 'absolute', bottom: -28, right: -18,
      }} />
    </>
  );
}

const BottomBarNav = createBottomTabNavigator();

function BottomBarNavigator() : JSX.Element {
  return (
    <BottomBarNav.Navigator
      tabBarOptions={{
        activeTintColor: colors.accent,
        inactiveTintColor: colors.primary,
        keyboardHidesTabBar: true,
        style: {
          paddingBottom: 10,
          height: 75,
        },
      }}
    >
      <BottomBarNav.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? 'accent' : 'primary';
            const isFocused = useIsFocused();
            return (
              <>
                <animator.BottomTabHighlightsAnimator focused={isFocused}>
                  <Highlights />
                </animator.BottomTabHighlightsAnimator>
                <animator.BottomTabIconAnimator focused={isFocused}>
                  <Icon library='FontAwesome5' name='user' color={iconColor} size={18} style={{ marginBottom: -10 }} />
                </animator.BottomTabIconAnimator>
              </>
            );
          },
        }}
      >
        {(props) => <DummyScreen {...props} text={'profile'} />}
      </BottomBarNav.Screen>
      <BottomBarNav.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? 'accent' : 'primary';
            const isFocused = useIsFocused();
            return (
              <>
                <animator.BottomTabHighlightsAnimator focused={isFocused}>
                  <Highlights />
                </animator.BottomTabHighlightsAnimator>
                <animator.BottomTabIconAnimator focused={isFocused}>
                  <Icon library='FontAwesome5' name='home' color={iconColor} size={18} style={{ marginBottom: -10 }} />
                </animator.BottomTabIconAnimator>
              </>
            );
          },
        }}
      >
        {(props) => <HomeScreen {...props} text={'home'} />}
      </BottomBarNav.Screen>
      <BottomBarNav.Screen
        name="Your Fixes"
        options={{
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? 'accent' : 'primary';
            const isFocused = useIsFocused();
            return (
              <>
                <animator.BottomTabHighlightsAnimator focused={isFocused}>
                  <Highlights />
                </animator.BottomTabHighlightsAnimator>
                <animator.BottomTabIconAnimator focused={isFocused}>
                  <Icon library='FontAwesome5' name='hammer' color={iconColor} size={18} style={{ marginBottom: -10 }} />
                </animator.BottomTabIconAnimator>
              </>
            );
          },
        }}
      >
        {(props) => <DummyScreen {...props} text={'your fixes'} />}
      </BottomBarNav.Screen>
      <BottomBarNav.Screen
        name="Chat"
        options={{
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? 'accent' : 'primary';
            const isFocused = useIsFocused();
            return (
              <>
                <animator.BottomTabHighlightsAnimator focused={isFocused}>
                  <Highlights />
                </animator.BottomTabHighlightsAnimator>
                <animator.BottomTabIconAnimator focused={isFocused}>
                  <Icon library='FontAwesome5' name='comment' color={iconColor} size={18} style={{ marginBottom: -10 }} />
                </animator.BottomTabIconAnimator>
              </>
            );
          },
        }}
      >
        {(props) => <DummyScreen {...props} text={'chat'} />}
      </BottomBarNav.Screen>
    </BottomBarNav.Navigator>
  );
}

export default BottomBarNavigator;
