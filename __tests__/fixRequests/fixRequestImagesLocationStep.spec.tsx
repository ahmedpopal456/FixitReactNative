import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import FixRequestImagesLocationStep from '../../src/screens/fixRequests/fixRequestImagesLocationStep';

describe('Fix Request Images Location Step', () => {
  const props = {
    navigation: { FixRequestImagesLocationStep: undefined },
    fixAddress: 'addr',
    fixCity: 'city',
    fixProvince: 'prov',
    fixPostalCode: 'code',
    fixStepsDynamicRoutes: [],
    numberOfSteps: 1,
  };
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <FixRequestImagesLocationStep {...props} />
      </Provider>,
    );
  });
});
