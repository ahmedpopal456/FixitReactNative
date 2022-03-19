import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from '../../../../store';
import ChatScreen from '../chatScreen';

describe('Chat screen', () => {
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <ChatScreen />
      </Provider>,
    );
  });
});
