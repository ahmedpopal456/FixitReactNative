import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Calendar from '../calendar';

describe('Fix Search Header', () => {
  const props = {
    parentSchedules: [],
    canUpdate: false,
  };

  it('renders correctly', async () => {
    const calendar = renderer.create(
      <Calendar {...props} />,
    ).toJSON();
    expect(calendar).toMatchSnapshot();
  });
});
