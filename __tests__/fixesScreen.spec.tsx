import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import FixesScreen from '../src/screens/fixesScreen';

jest.useFakeTimers();
it('renders correctly', async () => {
  renderer.create(<FixesScreen />);
});
