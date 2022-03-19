import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from '../../store';
import HomeScreenCraftsman from '../home/homeScreenCraftsman';

describe('Home Screen Craftsman', () => {
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <HomeScreenCraftsman />
      </Provider>,
    );
  });
});
