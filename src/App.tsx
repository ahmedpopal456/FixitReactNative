import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppStackNavigator from './navigators/appStackNavigator';

const App = () : JSX.Element => (
  <NavigationContainer>
    <StatusBar />
    <AppStackNavigator />
  </NavigationContainer>
);

export default App;
