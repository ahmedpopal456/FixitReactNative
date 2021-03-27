import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, store } from 'fixit-common-data-store';
import BottomBarNavigator from '../src/navigators/bottomBarNavigator';

jest.mock('../src/screens/accountScreen');

jest.useFakeTimers();
it('renders correctly', async () => {
  renderer.create(
    <Provider store={store}>
      <NavigationContainer>
        <BottomBarNavigator />
      </NavigationContainer>,
    </Provider>,
  );
});
