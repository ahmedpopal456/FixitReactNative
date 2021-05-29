import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ChatProfileScreen from '../chatProfileScreen';

describe('Chat profile screen', () => {
  it('renders correctly', async () => {
    const fixOverview = renderer.create(
      <ChatProfileScreen />,
    ).toJSON();
    expect(fixOverview).toMatchSnapshot();
  });
});
