import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from '../../../../store';
import AccountScreen from '../accountScreen';

jest.mock('../../../../core/services/authentication/nativeAuthService');
jest.useFakeTimers();
it('renders correctly', async () => {
  shallow(
    <Provider store={store}>
      <AccountScreen />,
    </Provider>,
  );
});
