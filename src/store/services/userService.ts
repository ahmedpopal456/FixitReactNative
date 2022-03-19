import {
  ADD_USERADDRESS_BEGIN,
  ADD_USERADDRESS_SUCCESS,
  ADD_USERADDRESS_FAILURE,
  UPDATE_USERADDRESS_BEGIN,
  UPDATE_USERADDRESS_SUCCESS,
  UPDATE_USERADDRESS_FAILURE,
  REMOVE_USERADDRESS_BEGIN,
  REMOVE_USERADDRESS_SUCCESS,
  REMOVE_USERADDRESS_FAILURE,
  FETCH_USER_BEGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  UserAddressModel,
  UserAddressModelBase,
  UserSummaryModel,
  UPDATE_PROFILEPICTURE_FAILURE,
  UPDATE_PROFILEPICTURE_SUCCESS,
  UPDATE_PROFILEPICTURE_BEGIN,
} from '../slices/userSlice';
import BaseConfigProvider from '../config/providers/baseConfigProvider';
import axios from 'axios';
import Logger from '../../logger';

export default class UserService {
  config: BaseConfigProvider;

  store: any;

  constructor(config: BaseConfigProvider, store: any) {
    this.config = config;
    this.store = store;
  }

  async fetchUser(userId: string): Promise<UserSummaryModel> {
    this.store.dispatch(FETCH_USER_BEGIN());
    const response = await fetch(`${this.config.userApiBaseUrl}/users/${userId}/account/profile/summary`).catch(
      (error) => this.store.dispatch(FETCH_USER_FAILURE(error)),
    );

    const data = await response.json();
    this.store.dispatch(FETCH_USER_SUCCESS(data.result));
    return data;
  }

  async updateUserProfilePicture(userId: string, profilePictureUrl: string): Promise<any> {
    this.store.dispatch(UPDATE_PROFILEPICTURE_BEGIN());
    const profilePicture = { profilePictureUrl };
    try {
      const response = await axios.put(
        `${this.config.userApiBaseUrl}/users/${userId}/account/profile/profilePicture`,
        profilePicture,
      );
      const profilePictureData = response.data;
      this.store.dispatch(UPDATE_PROFILEPICTURE_SUCCESS(profilePictureData));
      return profilePictureData;
    } catch (error: any) {
      this.store.dispatch(UPDATE_PROFILEPICTURE_FAILURE(error));
      Logger.instance.trackException({ exception: error });
    }
  }

  async addUserAddresses(userId: string, addressModel: UserAddressModelBase): Promise<UserAddressModel> {
    this.store.dispatch(ADD_USERADDRESS_BEGIN());

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressModel),
    };

    const response = await fetch(`${this.config.userApiBaseUrl}/users/${userId}/addresses`, requestOptions).catch(
      (error) => this.store.dispatch(ADD_USERADDRESS_FAILURE(error)),
    );

    const data = await response.json();
    const userAddress = data.result;
    this.store.dispatch(ADD_USERADDRESS_SUCCESS(userAddress));
    this.fetchUser(userId);

    return userAddress;
  }

  async updateUserAddresses(
    userId: string,
    userAddressId: string,
    addressModel: UserAddressModel,
  ): Promise<UserAddressModel> {
    this.store.dispatch(UPDATE_USERADDRESS_BEGIN());

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressModel),
    };

    const response = await fetch(
      `${this.config.userApiBaseUrl}/users/${userId}/addresses/${userAddressId}`,
      requestOptions,
    ).catch((error) => this.store.dispatch(UPDATE_USERADDRESS_FAILURE(error)));

    const data = await response.json();
    const userAddress = data.result;

    this.store.dispatch(UPDATE_USERADDRESS_SUCCESS(userAddress));
    this.fetchUser(userId);

    return userAddress;
  }

  // TODO: Add OperationStatus Model
  async removeUserAddresses(userId: string, userAddressId: string): Promise<any> {
    this.store.dispatch(REMOVE_USERADDRESS_BEGIN());
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(
      `${this.config.userApiBaseUrl}/users/${userId}/addresses/${userAddressId}`,
      requestOptions,
    ).catch((error) => this.store.dispatch(REMOVE_USERADDRESS_FAILURE(error)));

    const data = await response.json();
    this.store.dispatch(REMOVE_USERADDRESS_SUCCESS(userAddressId));
    this.fetchUser(userId);

    return data;
  }
}
