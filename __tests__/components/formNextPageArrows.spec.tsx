import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FormNextPageArrows from '../../src/components/formNextPageArrows';

describe('Form Next Page Arrows', () => {
  const mainClick = jest.fn();
  const onClick = jest.fn();
  const props = {
    mainClick,
    secondaryClickOptions: [{
      label: 'some label',
      onClick,
    }],
  };

  it('renders correctly', async () => {
    const formNextPageArrows = renderer.create(
      <FormNextPageArrows {...props} />,
    ).toJSON();
    expect(formNextPageArrows).toMatchSnapshot();
  });

  it('shows next steps options', async () => {
    const wrapper = shallow(
      <FormNextPageArrows {...props} />,
    );
    wrapper.setState({ showNextStepsOptions: false });
    wrapper.instance().showNextStepsOptions();
    expect(wrapper.instance().state.showNextStepsOptions).toBeTruthy();
  });

  it('handles main click', async () => {
    const wrapper = shallow(
      <FormNextPageArrows {...props} />,
    );
    wrapper.instance().handleMainClick();
    expect(mainClick).toHaveBeenCalledTimes(1);
  });
});
