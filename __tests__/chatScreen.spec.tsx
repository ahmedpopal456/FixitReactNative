import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import ChatScreen from '../src/screens/chatScreen';

describe('Chat screen', () => {
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <ChatScreen />
      </Provider>,
    );
  });
});
