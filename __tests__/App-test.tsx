/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../src/App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../b2c/b2cClient.ts');

it('renders correctly', () => {
  renderer.create(<App />);
});
