import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from '../../../../store';
import ChatMessagingScreen from '../chatMessagingScreen';

describe('Chat messaging screen', () => {
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <ChatMessagingScreen />
      </Provider>,
    );
  });
});
