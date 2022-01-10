import React, { FunctionComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../../../components/headers/header';
import ChatScreen from '../screens/chatScreen';
import ChatMessagingScreen from '../screens/chatMessagingScreen';

const Stack = createStackNavigator();
const ChatStackNavigator: FunctionComponent<any> = (props) => (
  <Stack.Navigator
    headerMode="screen"
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
          userAddress={props.otherProp.userAddress}></Header>
      ),
    }}>
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen name="ChatMessage" component={ChatMessagingScreen} />
  </Stack.Navigator>
);
export default ChatStackNavigator;
