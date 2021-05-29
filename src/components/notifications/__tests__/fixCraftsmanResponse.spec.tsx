import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FixCraftsmanResponse from '../fixCraftsmanResponse';

describe('Fix Search Header', () => {
  const dismissNotif = jest.fn();
  const props = {
    message: {},
    type: 1,
    onDismissNotification: dismissNotif,
  };

  it('renders correctly', async () => {
    const fixCraftsmanResponse = renderer.create(
      <FixCraftsmanResponse {...props} />,
    ).toJSON();
    expect(fixCraftsmanResponse).toMatchSnapshot();
  });

  it('handle view details', () => {
    const wrapper = shallow(
      <FixCraftsmanResponse {...props} />,
    );
    wrapper.instance().handleViewDetails();
    expect(dismissNotif).toHaveBeenCalledTimes(1);
  });
});
