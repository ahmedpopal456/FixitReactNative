import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from '../../../../store';
import SecurityScreen from '../securityScreen';

describe('Security Screen', () => {
  it('renders correctly', async () => {
    shallow(
      <Provider store={store}>
        <SecurityScreen />
      </Provider>,
    );
  });
});
