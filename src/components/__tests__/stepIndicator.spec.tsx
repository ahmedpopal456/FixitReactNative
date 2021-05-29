import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import StepIndicator from '../stepIndicator';

describe('Step Indicator', () => {
  const props = {
    numberSteps: 3,
    currentStep: 1,
  };

  it('renders correctly', async () => {
    const stepIndicator = renderer.create(
      <StepIndicator {...props} />,
    ).toJSON();
    expect(stepIndicator).toMatchSnapshot();
  });

  it('should return proper array for step indicators', () => {
    const wrapper = shallow(
      <StepIndicator {...props} />,
    );
    expect(wrapper.instance().createStepIndicators()).toHaveLength(3);
  });
});
