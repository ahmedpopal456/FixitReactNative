import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import NotificationsScreen from '../../features/notifications/screens/notificationsScreen';

describe('Notifications Screen', () => {
  it('renders correctly', async () => {
    shallow(
      <Provider store={store}>
        <NotificationsScreen />
      </Provider>,
    );
  });
});
