import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ProfileScreen from '../src/screens/profileScreen';

jest.useFakeTimers();
it('renders correctly', async () => {
  renderer.create(<ProfileScreen />);
});
