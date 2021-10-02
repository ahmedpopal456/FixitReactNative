import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import FixRequestSectionsStep, { FixRequestSectionsStepProps } from '../fixRequestSectionsStep';

describe('Fix Request Sections Step', () => {
  const props : FixRequestSectionsStepProps = {
    navigation: {},
    fixRequest: {},
    fixStepsDynamicRoutes: [],
    numberOfSteps: 1,
    fixStepsCurrentRouteIndex: 1,
    fixTemplateId: '',
  };
  it('renders correctly', () => {
    shallow(
      <Provider store={store}>
        <FixRequestSectionsStep {...props} />
      </Provider>,
    );
  });
});