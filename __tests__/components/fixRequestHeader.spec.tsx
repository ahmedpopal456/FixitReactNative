import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FixRequestHeader from '../../src/components/fixRequestHeader';

describe('Fix Search Header', () => {
  const goBack = jest.fn();
  const canGoBack = jest.fn();
  canGoBack.mockImplementation(() => true);
  const props = {
    showBackBtn: false,
    navigation: {
      goBack,
      canGoBack,
      HomeScreen: undefined,
      SearchResultsScreen: {
        tags: [],
      },
      FixRequestMetaStep: undefined,
      FixRequestDescriptionStep: undefined,
      FixRequestSectionsStep: undefined,
      FixRequestImagesLocationStep: undefined,
      FixRequestScheduleStep: undefined,
      FixRequestReview: {
        passedFix: {},
        isFixCraftsmanResponseNotification: false,
      },
      FixSuggestChanges: { passedFix: {} },
      FixSuggestChangesReview: { passedFix: {}, cost: '', comments: '' },
    },
    screenTitle: 'screen title',
    textHeight: 10,
  };

  it('renders correctly', async () => {
    const fixRequestHeader = renderer.create(
      <FixRequestHeader {...props} />,
    ).toJSON();
    expect(fixRequestHeader).toMatchSnapshot();
  });

  it('handle go back', async () => {
    const wrapper = shallow(
      <FixRequestHeader {...props} />,
    );
    wrapper.instance().handleGoBack();
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
