import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import FixSuggestChangesReview from '../../src/screens/fixRequests/fixSuggestChangesReview';

describe('Fix Suggest Changes Review', () => {
  const props = {
    navigation: {},
    passedFix: {},
    fixRequestObj: {},
  };
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <FixSuggestChangesReview {...props} />
      </Provider>,
    );
  });
});
