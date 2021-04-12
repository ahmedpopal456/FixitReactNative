import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FixSearchHeader from '../../src/components/fixSearchHeader';

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
  };

  it('renders correctly', async () => {
    const fixSearchHeader = renderer.create(
      <FixSearchHeader {...props} />,
    ).toJSON();
    expect(fixSearchHeader).toMatchSnapshot();
  });

  it('handle go back', async () => {
    const wrapper = shallow(
      <FixSearchHeader {...props} />,
    );
    wrapper.instance().handleGoBack();
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
