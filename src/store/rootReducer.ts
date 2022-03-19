import { combineReducers, CombinedState, Reducer } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import accountReducer, { accountInitialState, AccountState } from './slices/accountSlice';
import profileReducer, { profileInitialState, ProfileState } from './slices/profileSlice';
import ratingsReducer, { ratingInitialState, RatingsState } from './slices/ratingSlice';
import userReducer, { userInitialState, UserState } from './slices/userSlice';
import notificationsReducer, { notificationInitialState } from './slices/notificationsSlice';
import fixesReducer, { fixesInitialState, FixesStates } from './slices/fixesSlice';
import fixRequestReducer, { fixRequestInitialState, FixRequestState } from './slices/fixRequestSlice';
import persistentReducer, { persistantInitialState } from './storage/persistentReducer';
import chatReducer, { chatInitialState, ChatState } from './slices/chatSlice';
import addressReducer, { addressInitialState, AddressState } from './slices/addressSlice';
import { PersistentStateModel } from './models/persistentStore/persistentStateModel';
import fixTemplateReducer, { fixTemplateInitialState, FixTemplateState } from './slices/fixTemplateSlice';
import { NotificationsStates } from './slices/notificationsSlice';
import { PayloadAction, createAction } from '@reduxjs/toolkit';
import { FixitAction } from './models/common/fixitAction';

export const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'persist'],
};

export interface RootState {
  persist: PersistentStateModel;
  user: UserState;
  account: AccountState;
  profile: ProfileState;
  ratings: RatingsState;
  fixRequest: FixRequestState;
  fixTemplate: FixTemplateState;
  fixes: FixesStates;
  address: AddressState;
  notifications: NotificationsStates;
  chat: ChatState;
}

export const appReducer: Reducer<CombinedState<RootState>> = combineReducers({
  persist: persistentReducer,
  user: userReducer,
  account: accountReducer,
  profile: profileReducer,
  ratings: ratingsReducer,
  fixRequest: fixRequestReducer,
  fixTemplate: fixTemplateReducer,
  fixes: fixesReducer,
  address: addressReducer,
  notifications: notificationsReducer,
  chat: chatReducer,
});

export const rootReducer = (state: RootState, action: PayloadAction<any>) => {
  if (action.type === 'RESET_ROOT_STATE') {
    return appReducer(
      {
        address: addressInitialState,
        account: accountInitialState,
        fixRequest: fixRequestInitialState,
        fixTemplate: fixTemplateInitialState,
        fixes: fixesInitialState,
        notifications: notificationInitialState,
        profile: profileInitialState,
        ratings: ratingInitialState,
        user: userInitialState,
        persist: persistantInitialState,
        chat: chatInitialState,
      } as CombinedState<RootState>,
      action,
    );
  }
  return appReducer(state, action);
};

const prepare = <T>(): FixitAction<T> => ({
  payload: {} as T,
  type: 'inherit',
  meta: 'empty',
  error: null,
});

export const rootReducerActions = {
  RESET_ROOT_STATE: createAction('RESET_ROOT_STATE', () => prepare()),
};
