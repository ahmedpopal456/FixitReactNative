import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import AccountScreen from '../src/screens/accountScreen';

jest.mock('../src/services/nativeAuthService');
jest.useFakeTimers();
it('renders correctly', async () => {
  shallow(
    <Provider store={store}>
      <AccountScreen />,
    </Provider>,
  );
});
