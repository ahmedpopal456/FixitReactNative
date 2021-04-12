import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FormTextInput from '../../src/components/formTextInput';

describe('Form Text Input', () => {
  const onChange = jest.fn();
  const onFocus = jest.fn();
  const onBlur = jest.fn();
  const props = {
    onChange,
    onFocus,
    onBlur,
    big: false,
    value: 'some value',
    title: 'some title',
    padLeft: false,
    numeric: false,
  };

  it('renders correctly', async () => {
    const formTextInput = renderer.create(
      <FormTextInput {...props} />,
    ).toJSON();
    expect(formTextInput).toMatchSnapshot();
  });

  it('called onFocus', async () => {
    const wrapper = shallow(
      <FormTextInput {...props} />,
    );
    wrapper.instance().onFocus();
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('called onBlur', async () => {
    const wrapper = shallow(
      <FormTextInput {...props} />,
    );
    wrapper.instance().onBlur();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
