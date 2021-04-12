import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import HomeScreenClient from '../src/screens/homeScreenClient';

describe('Home Screen Craftsman', () => {
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <HomeScreenClient />
      </Provider>,
    );
  });
});
