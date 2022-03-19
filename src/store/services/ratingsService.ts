import {
  RatingsModel,
  FETCH_USERRATINGS_BEGIN,
  FETCH_USERRATINGS_SUCCESS,
  FETCH_USERRATINGS_FAILURE,
} from '../slices/ratingSlice';
import BaseConfigProvider from '../config/providers/baseConfigProvider';

export default class RatingsService {
  config: BaseConfigProvider;

  store: any;

  constructor(config: BaseConfigProvider, store: any) {
    this.config = config;
    this.store = store;
  }

  async getUserRatingsAverage(userId: string): Promise<RatingsModel | null> {
    this.store.dispatch(FETCH_USERRATINGS_BEGIN());
    try {
      const response = await fetch(`${this.config.userApiBaseUrl}/users/${userId}/account/ratings`);
      const data = await response.json();
      const ratingsResponse: RatingsModel = {
        ratingsId: data.ratings.id,
        averageRating: data.ratings.averageRating,
        ratings: data.ratings.ratings,
        ratingsOfUser: data.ratings.ratingsOfUser,
      };

      this.store.dispatch(FETCH_USERRATINGS_SUCCESS(ratingsResponse));
      return ratingsResponse;
    } catch (error) {
      this.store.dispatch(FETCH_USERRATINGS_FAILURE(error));
    }
    return null;
  }
}
