/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar
} from 'react-native';

import { Button, Icon } from 'fixit-mobile-components';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Button onPress={() => console.log("Button Pressed")} color="accent" shape="circle">
          <Icon library="AntDesign" name="barschart" color="primary" />
        </Button>
      </SafeAreaView>
    </>
  );
};

export default App;
