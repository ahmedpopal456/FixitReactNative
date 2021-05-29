import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import FixSuggestChanges from '../fixSuggestChanges';

describe('Fix Suggest Changes', () => {
  const props = {
    navigation: {},
    passedFix: {},
    fixRequestObj: {},
  };
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <FixSuggestChanges {...props} />
      </Provider>,
    );
  });
});
