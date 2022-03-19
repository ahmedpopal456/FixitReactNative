import { createSlice } from '@reduxjs/toolkit';
import { FixitAction } from '../models/common/fixitAction';

export interface AccountModel {
  userId: string;
  email: string;
  password: string;
}

export interface AccountState extends AccountModel {
  isLoading: boolean;
  error: any;
}

export const accountInitialState: AccountState = {
  userId: '',
  email: '',
  password: '',
  isLoading: false,
  error: null,
};

const prepareSuccess = (payload: AccountModel): FixitAction<AccountModel> => ({
  payload,
  type: 'inherit',
  meta: 'empty',
  error: null,
});

const prepareFailure = (error: any | null = null): FixitAction<AccountModel> => ({
  payload: accountInitialState,
  type: 'inherit',
  meta: 'empty',
  error,
});

const accountSlice = createSlice({
  name: 'account',
  initialState: accountInitialState,
  reducers: {
    UPDATE_ACCOUNTINFO_BEGIN: (state: AccountState) => {
      state.error = null;
      state.isLoading = true;
    },
    UPDATE_ACCOUNTINFO_SUCCESS: {
      reducer: (state: AccountState, action: FixitAction<AccountModel>) => {
        state.email = action.payload.email;
        state.userId = action.payload.userId;
        state.password = action.payload.password;
        state.isLoading = false;
        state.error = null;
      },
      prepare: prepareSuccess,
    },
    UPDATE_ACCOUNTINFO_FAILURE: {
      reducer: (state: AccountState, action: FixitAction<AccountModel>) => {
        state.isLoading = false;
        state.error = action.error;
      },
      prepare: prepareFailure,
    },
  },
});

export const { UPDATE_ACCOUNTINFO_BEGIN, UPDATE_ACCOUNTINFO_SUCCESS, UPDATE_ACCOUNTINFO_FAILURE } =
  accountSlice.actions;

export default accountSlice.reducer;
