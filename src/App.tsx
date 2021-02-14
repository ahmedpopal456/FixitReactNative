import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppStackNavigator from './navigators/appStackNavigator';

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar />
        <AppStackNavigator />
      </NavigationContainer>
    );
  }
}

export default App;
