import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from '../../../../store';
import ProfileScreen from '../profileScreen';

jest.useFakeTimers();
it('renders correctly', async () => {
  shallow(
    <Provider store={store}>
      <ProfileScreen />,
    </Provider>,
  );
});
