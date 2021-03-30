import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../screens/chatScreen';
import ChatProfileScreen from '../screens/chatProfileScreen';
import ChatMessagingScreen from '../screens/chatMessagingScreen';

const Stack = createStackNavigator();

function ChatStackNavigator(): JSX.Element {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ChatProfile" component={ChatProfileScreen}/>
      <Stack.Screen name="ChatMessage" component={ChatMessagingScreen}/>
    </Stack.Navigator>
  );
}

export default ChatStackNavigator;
