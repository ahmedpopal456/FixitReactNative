import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import SecurityScreen from '../src/screens/securityScreen';

describe('Security Screen', () => {
  it('renders correctly', async () => {
    shallow(
      <Provider store={store}>
        <SecurityScreen />
      </Provider>,
    );
  });
});
