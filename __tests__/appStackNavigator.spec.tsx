import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import AppStackNavigator from '../src/navigators/appStackNavigator';

jest.mock('../src/b2c/b2cClient.ts');
jest.useFakeTimers();
it('renders correctly', () => {
  renderer.create(
    <NavigationContainer>
      <AppStackNavigator />
    </NavigationContainer>,
  );
});
