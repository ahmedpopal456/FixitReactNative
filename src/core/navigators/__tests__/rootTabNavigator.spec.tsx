import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, store } from '../../../store';
import RootTabNavigator from '../rootTabNavigator';

jest.mock('../../../features/userprofile/screens/accountScreen');
jest.mock('../../services/authentication/nativeAuthService');
jest.useFakeTimers();
it('renders correctly', async () => {
  shallow(
    <Provider store={store}>
      <NavigationContainer>
        <RootTabNavigator />
      </NavigationContainer>
      ,
    </Provider>,
  );
});
