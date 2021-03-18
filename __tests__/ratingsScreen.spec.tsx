import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import RatingsScreen from '../src/screens/ratingsScreen';

jest.useFakeTimers();
it('renders correctly', async () => {
  renderer.create(<RatingsScreen />);
});
