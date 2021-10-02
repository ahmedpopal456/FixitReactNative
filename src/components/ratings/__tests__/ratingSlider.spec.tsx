import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import RatingsSlider from '../ratingsSlider';

describe('User Rating Slider', () => {
  const props = {
    score: 3,
  };

  it('renders correctly', async () => {
    const userRatingSlider = renderer.create(
      <RatingsSlider {...props} />,
    ).toJSON();
    expect(userRatingSlider).toMatchSnapshot();
  });

  it('should display proper caret color', () => {
    const wrapper = shallow(
      <RatingsSlider {...props} />,
    );
    expect(wrapper.instance().calculateCaretColor(1)).toEqual('#D4675A');
  });

  it('should calculate the caret offset', () => {
    const wrapper = shallow(
      <RatingsSlider {...props} />,
    );
    expect(wrapper.instance().calculateCaretOffset()).toEqual(4.05);
  });
});