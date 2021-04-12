import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FixOverviewScreen from '../src/screens/fixOverviewScreen';

describe('Fix Overview', () => {
  const props = {
    route: {
      params: {
        fix: {
          details: [{
            name: 'Tile',
            description: 'Fix tile',
          }],
          schedule: [{
            startTimestampUtc: 1618126659,
            endTimestampUtc: 1618126659,
          }],
        },
      },
    },
  };

  it('renders correctly', async () => {
    shallow(
      <FixOverviewScreen {...props} />,
    );
  });

  it('should display proper task title', () => {
    const wrapper = shallow(
      <FixOverviewScreen {...props} />,
    );
    wrapper.setState({
      tasks: [
        { title: 'task 1' },
        { title: 'task 2' },
        { title: 'task 3' },
      ],
    });
    expect(wrapper.instance().displayTaskTitle(1)).toEqual('task 1');
    expect(wrapper.instance().displayTaskTitle(2)).toEqual('task 2');
    expect(wrapper.instance().displayTaskTitle(3)).toEqual('task 3');
  });
});
