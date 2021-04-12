import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SplashScreen from '../src/screens/splashScreen';

describe('Splash Screen', () => {
  it('renders correctly', () => {
    const screen = renderer.create(<SplashScreen />).toJSON();
    expect(screen).toMatchSnapshot();
  });
});
