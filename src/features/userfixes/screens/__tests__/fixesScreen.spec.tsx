import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from '../../../../store';
import FixesScreen from '../fixesScreen';

jest.useFakeTimers();
it('renders correctly', async () => {
  shallow(
    <Provider store={store}>
      <FixesScreen />
    </Provider>,
  );
});
