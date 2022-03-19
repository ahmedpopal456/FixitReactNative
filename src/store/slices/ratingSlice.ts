import { createSlice } from '@reduxjs/toolkit';
import { FixitAction } from '../models/common/fixitAction';
import { UserSummaryModel } from './userSlice';

export enum RatingType {
  SYSTEM,
  USER,
}
export interface RatingModel {
  score: number;
  reviewedByUser: UserSummaryModel;
  ReviewedUser: UserSummaryModel;
  comment: string;
  createdTimestampsUtc: number;
  updatedTimestampsUtc: number;
  type: RatingType;
}
export interface RatingsModel {
  ratingsId: string;
  averageRating: number;
  ratings: Array<RatingModel>;
  ratingsOfUser: UserSummaryModel;
}

export interface RatingsState extends RatingsModel {
  isLoading: boolean;
  error: any;
}

export const ratingInitialState: RatingsState = {
  ratingsId: '',
  averageRating: 0,
  ratings: [],
  ratingsOfUser: {} as UserSummaryModel,
  isLoading: false,
  error: null,
};

const prepareSuccess = (payload: RatingsModel): FixitAction<RatingsModel> => ({
  payload,
  type: 'inherit',
  meta: 'empty',
  error: null,
});

const prepareFailure = (error: any | null = null): FixitAction<RatingsModel> => ({
  payload: ratingInitialState,
  type: 'inherit',
  meta: 'empty',
  error,
});

const ratingSlice = createSlice({
  name: 'rating',
  initialState: ratingInitialState,
  reducers: {
    FETCH_USERRATINGS_BEGIN: (state: RatingsState) => {
      state.error = null;
      state.isLoading = true;
    },
    FETCH_USERRATINGS_SUCCESS: {
      reducer: (state: RatingsState, action: FixitAction<RatingsModel>) => {
        state.ratingsId = action.payload.ratingsId;
        state.averageRating = action.payload.averageRating;
        state.ratings = action.payload.ratings;
        state.ratingsOfUser = action.payload.ratingsOfUser;
        state.isLoading = false;
        state.error = null;
      },
      prepare: prepareSuccess,
    },
    FETCH_USERRATINGS_FAILURE: {
      reducer: (state: RatingsState, action: FixitAction<RatingsModel>) => {
        state.isLoading = false;
        state.error = action.error;
      },
      prepare: prepareFailure,
    },
  },
});

export const { FETCH_USERRATINGS_BEGIN, FETCH_USERRATINGS_SUCCESS, FETCH_USERRATINGS_FAILURE } = ratingSlice.actions;
export default ratingSlice.reducer;
