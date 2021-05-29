import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import BottomTabIconAnimator from '../bottomTabIconAnimator';

jest.useFakeTimers();
it('renders correctly', () => {
  renderer.create(<BottomTabIconAnimator />);
});
