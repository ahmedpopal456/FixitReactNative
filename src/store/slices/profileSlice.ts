import { createSlice } from '@reduxjs/toolkit';
import { FixitAction } from '../models/common/fixitAction';
import { UserAddressModel } from './userSlice';

export interface ProfileModel {
  firstName: string;
  lastName: string;
  address: UserAddressModel;
  profilePictureUrl: string;
  availability: any;
}

export interface ProfileState extends ProfileModel {
  isLoading: boolean;
  error: any;
}

export const profileInitialState: ProfileState = {
  firstName: '',
  lastName: '',
  address: {} as UserAddressModel,
  profilePictureUrl: '',
  availability: [],
  isLoading: false,
  error: null,
};

const prepareSuccess = (payload: ProfileModel): FixitAction<ProfileModel> => ({
  payload,
  type: 'inherit',
  meta: 'empty',
  error: null,
});

const prepareFailure = (error: any | null = null): FixitAction<ProfileModel> => ({
  payload: profileInitialState,
  type: 'inherit',
  meta: 'empty',
  error,
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: profileInitialState,
  reducers: {
    FETCH_PROFILEINFO_BEGIN: (state: ProfileState) => {
      state.error = null;
      state.isLoading = true;
    },
    FETCH_PROFILEINFO_SUCCESS: {
      reducer: (state: ProfileState, action: FixitAction<ProfileModel>) => {
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.profilePictureUrl = action.payload.profilePictureUrl;
        state.address = action.payload.address;
        state.availability = action.payload.availability;
        state.isLoading = false;
        state.error = null;
      },
      prepare: prepareSuccess,
    },
    FETCH_PROFILEINFO_FAILURE: {
      reducer: (state: ProfileState, action: FixitAction<ProfileModel>) => {
        state.isLoading = false;
        state.error = action.error;
      },
      prepare: prepareFailure,
    },
    UPDATE_PROFILEINFO_BEGIN: (state: ProfileState) => {
      state.error = null;
      state.isLoading = true;
    },
    UPDATE_PROFILEINFO_SUCCESS: {
      reducer: (state: ProfileState, action: FixitAction<ProfileModel>) => {
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.isLoading = false;
        state.error = null;
      },
      prepare: prepareSuccess,
    },
    UPDATE_PROFILEINFO_FAILURE: {
      reducer: (state: ProfileState, action: FixitAction<ProfileModel>) => {
        state.isLoading = false;
        state.error = action.error;
      },
      prepare: prepareFailure,
    },
  },
});

export const {
  FETCH_PROFILEINFO_BEGIN,
  FETCH_PROFILEINFO_SUCCESS,
  FETCH_PROFILEINFO_FAILURE,
  UPDATE_PROFILEINFO_BEGIN,
  UPDATE_PROFILEINFO_SUCCESS,
  UPDATE_PROFILEINFO_FAILURE,
} = profileSlice.actions;
export default profileSlice.reducer;
