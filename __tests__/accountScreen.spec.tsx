import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import AccountScreen from '../src/screens/accountScreen';

jest.useFakeTimers();
it('renders correctly', async () => {
  renderer.create(<AccountScreen />);
});
