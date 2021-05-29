import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import FixRequestMetaStep, { FixRequestMetaStepScreenProps } from '../fixRequestMetaStep';

describe('Fix Request Meta Step', () => {
  const props : FixRequestMetaStepScreenProps = {
    navigation: {},
    tags: [],
    templateName: '',
    templateCategory: '',
    templateType: '',
    fixTitle: '',
    numberOfSteps: 1,
    templateId: '',
    fixObj: {},
  };
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <FixRequestMetaStep {...props} />
      </Provider>,
    );
  });
});
