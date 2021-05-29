import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { Provider, store } from 'fixit-common-data-store';
import FixRequestDescriptionStep, { FixRequestDescriptionStepProps } from '../fixRequestDescriptionStep';

describe('Fix Request Description Step', () => {
  const props : FixRequestDescriptionStepProps = {
    navigation: { },
    fixTemplateId: 'template id',
    fixRequestObj: {},
    fixStepsDynamicRoutes: [],
    numberOfSteps: 1,
  };
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <FixRequestDescriptionStep {...props} />
      </Provider>,
    );
  });
});
