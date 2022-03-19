import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from '../../../../store';
import RatingsScreen from '../ratingsScreen';

jest.useFakeTimers();
it('renders correctly', async () => {
  shallow(
    <Provider store={store}>
      <RatingsScreen />,
    </Provider>,
  );
});
