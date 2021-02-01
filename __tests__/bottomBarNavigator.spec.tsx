import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import BottomBarNavigator from '../src/navigators/bottomBarNavigator';

jest.useFakeTimers();
it('renders correctly', () => {
  renderer.create(
    <NavigationContainer>
      <BottomBarNavigator />
    </NavigationContainer>,
  );
});
