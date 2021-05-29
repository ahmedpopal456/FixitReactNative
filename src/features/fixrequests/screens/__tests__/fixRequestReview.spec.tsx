import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import FixRequestReview from '../fixRequestReview';

describe('Fix Request Review', () => {
  const props = {
    navigation: {},
    fixRequestObj: {},
    passedFix: {},
    isFixCraftsmanResponseNotification: false,
  };
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <FixRequestReview {...props} />
      </Provider>,
    );
  });
});
