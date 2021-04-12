import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import FixRequestScheduleStep from '../../src/screens/fixRequests/fixRequestScheduleStep';

describe('Fix Request Schedule Step', () => {
  const props = {
    navigation: {},
    clientMinEstimatedCost: '',
    clientMaxEstimatedCost: '',
    fixRequestObj: {},
    fixStepsDynamicRoutes: [],
    numberOfSteps: 1,
  };
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <FixRequestScheduleStep {...props} />
      </Provider>,
    );
  });
});
