import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { Provider, notificationActions, rootContext } from 'fixit-common-data-store';
import configureStore from 'redux-mock-store';
import { render, queryByAttribute } from 'react-testing-library';
import { Button } from 'fixit-common-ui';
import NotificationDispatcher from '../../../src/components/notifications/NotificationDispatcher';

jest.useFakeTimers();
const mockStore = configureStore();
describe('NotificationDispatcher', () => {
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
        <NotificationDispatcher />
      </Provider>,
    );
  });

  it('should render with given state from Redux store', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should dispatch dismissNotification on button press', () => {
    renderer.act(() => {
      renderer.act(() => {
        component.root.findByType(Button).props.onPress();
      });

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        notificationActions.default.dismissNotification('test-notif-id'),
      );
    });
  });
});
