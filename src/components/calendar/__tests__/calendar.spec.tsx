import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Calendar from '../calendar';

describe('Fix Search Header', () => {
  const props = {
    startDate: new Date(),
    endDate: new Date(),
    canUpdate: false,
  };

  it('renders correctly', async () => {
    const calendar = renderer.create(
      <Calendar {...props} />,
    ).toJSON();
    expect(calendar).toMatchSnapshot();
  });

  it('generate matrix', async () => {
    const wrapper = shallow(
      <Calendar {...props} />,
    );
    expect(wrapper.instance().generateMatrix().length).toBeGreaterThan(1);
  });

  it('date is not highlighted', async () => {
    const wrapper = shallow(
      <Calendar {...props} />,
    );
    expect(wrapper.instance().dateIsHighlighted({
      label: '', type: 'header', date: new Date(),
    })).toEqual(false);
  });

  it('date is not start date', async () => {
    const wrapper = shallow(
      <Calendar {...props} />,
    );
    expect(wrapper.instance().dateIsStartDate({
      label: '', type: 'header', date: new Date(),
    })).toEqual(false);
  });

  it('date is not end date', async () => {
    const wrapper = shallow(
      <Calendar {...props} />,
    );
    expect(wrapper.instance().dateIsEndDate({
      label: '', type: 'header', date: new Date(),
    })).toEqual(false);
  });
});
