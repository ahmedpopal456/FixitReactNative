import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import RatingsScreen from '../src/screens/ratingsScreen';

jest.useFakeTimers();
it('renders correctly', async () => {
  shallow(
    <Provider store={store}>
      <RatingsScreen />,
    </Provider>,
  );
});
