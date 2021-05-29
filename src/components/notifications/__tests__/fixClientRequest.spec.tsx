import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FixClientRequest from '../fixClientRequest';

describe('Fix Search Header', () => {
  const dismissNotif = jest.fn();
  const props = {
    message: {},
    type: 1,
    onDismissNotification: dismissNotif,
  };

  it('renders correctly', async () => {
    shallow(
      <FixClientRequest {...props} />,
    );
  });

  it('handle view details', () => {
    const wrapper = shallow(
      <FixClientRequest {...props} />,
    );
    wrapper.instance().handleViewDetails();
    expect(dismissNotif).toHaveBeenCalledTimes(1);
  });
});
