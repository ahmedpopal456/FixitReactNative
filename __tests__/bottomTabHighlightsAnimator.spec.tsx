import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import BottomTabHighlightsAnimator from '../src/animators/bottomTabHighlightsAnimator';

jest.useFakeTimers();
it('renders correctly', () => {
  renderer.create(<BottomTabHighlightsAnimator />);
});
