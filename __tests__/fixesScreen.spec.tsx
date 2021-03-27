import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import FixesScreen from '../src/screens/fixesScreen';

jest.useFakeTimers();
it('renders correctly', async () => {
  shallow(
    <Provider store={store}>
      <FixesScreen />
    </Provider>,
  );
});
