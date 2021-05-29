import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { Provider, notificationActions, rootContext } from 'fixit-common-data-store';
import configureStore from 'redux-mock-store';
import { render, queryByAttribute } from 'react-testing-library';
import NotificationRenderer from '../notificationRenderer';

jest.useFakeTimers();
const mockStore = configureStore();
describe('NotificationRenderer', () => {
  let store: any;
  let component: any;
  const initialState = {
    notifications: {
      messages: [{
        messageId: 'test-notif-id',
        notification: {
          title: 'test-1',
        },
      }],
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
    component = renderer.create(
      <Provider store={store} context={rootContext}>
        <NotificationRenderer />
      </Provider>,
    );
  });

  it('renders correctly', () => {
    renderer.create(
      <Provider store={store} context={rootContext}>
        <NotificationRenderer />
      </Provider>,
    );
  });
});
