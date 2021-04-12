import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SearchTextInput from '../../src/components/searchTextInput';

describe('Search Text Input', () => {
  const onChange = jest.fn();
  const onFocus = jest.fn();
  const onSubmitEditing = jest.fn();
  const props = {
    onChange,
    onFocus,
    big: false,
    value: 'some value',
    placeholder: 'some placeholder',
    onSubmitEditing,
  };

  it('renders correctly', async () => {
    const searchTextInput = renderer.create(
      <SearchTextInput {...props} />,
    ).toJSON();
    expect(searchTextInput).toMatchSnapshot();
  });
});
