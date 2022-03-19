import axios from 'axios';
import {
  ProfileModel,
  FETCH_PROFILEINFO_BEGIN,
  FETCH_PROFILEINFO_SUCCESS,
  FETCH_PROFILEINFO_FAILURE,
  UPDATE_PROFILEINFO_FAILURE,
  UPDATE_PROFILEINFO_SUCCESS,
  UPDATE_PROFILEINFO_BEGIN,
} from '../slices/profileSlice';
import BaseConfigProvider from '../config/providers/baseConfigProvider';

export default class ProfileService {
  config: BaseConfigProvider;

  store: any;

  constructor(config: BaseConfigProvider, store: any) {
    this.config = config;
    this.store = store;
  }

  getUserProfile(userId: string): Promise<ProfileModel> {
    this.store.dispatch(FETCH_PROFILEINFO_BEGIN());
    return axios
      .get(`${this.config.userApiBaseUrl}/users/${userId}/account/profile`)
      .then((response) => {
        this.store.dispatch(FETCH_PROFILEINFO_SUCCESS(response.data));
        return response.data;
      })
      .catch((error) => {
        this.store.dispatch(FETCH_PROFILEINFO_FAILURE(error));
      });
  }

  updateUserProfile(userId: string, updatedProfileInfo: ProfileModel): Promise<ProfileModel> {
    this.store.dispatch(UPDATE_PROFILEINFO_BEGIN());
    return axios
      .put(`${this.config.userApiBaseUrl}/users/${userId}/account/profile`, updatedProfileInfo, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        this.store.dispatch(UPDATE_PROFILEINFO_SUCCESS(response.data));
        return response.data;
      })
      .catch((error) => {
        this.store.dispatch(UPDATE_PROFILEINFO_FAILURE(error));
      });
  }
}
