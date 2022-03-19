import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from '../../store';
import HomeScreenClient from '../home/homeScreenClient';

describe('Home Screen Craftsman', () => {
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <HomeScreenClient />
      </Provider>,
    );
  });
});
