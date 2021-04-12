import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import HomeScreenCraftsman from '../src/screens/homeScreenCraftsman';

describe('Home Screen Craftsman', () => {
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <HomeScreenCraftsman />
      </Provider>,
    );
  });
});
