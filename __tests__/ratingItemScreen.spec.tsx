import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import { Provider, store } from 'fixit-common-data-store';
import RatingItemScreen from '../src/screens/ratingItemScreen';

describe('Security Screen', () => {
  const spyNavigate = jest.fn();
  const spyGoBack = jest.fn();
  const props = {
    navigation: {
      navigate: spyNavigate,
      goBack: spyGoBack,
    },
    route: {
      params: {
        firstName: 'Po',
        lastName: 'Tato',
        score: 2,
        comment: 'Some comment',
      },
    },
    unseenNotificationsNumber: 0,
  };

  it('renders correctly', async () => {
    shallow(
      <Provider store={store}>
        <RatingItemScreen {...props} />
      </Provider>,
    );
  });
});
