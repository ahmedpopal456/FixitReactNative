import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, store } from 'fixit-common-data-store';
import BottomBarNavigator from '../src/navigators/bottomBarNavigator';

jest.mock('../src/screens/accountScreen');
jest.useFakeTimers();
it('renders correctly', async () => {
  shallow(
    <Provider store={store}>
      <NavigationContainer>
        <BottomBarNavigator />
      </NavigationContainer>,
    </Provider>,
  );
});
