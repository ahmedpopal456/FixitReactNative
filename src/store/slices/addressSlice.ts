import { createSlice } from '@reduxjs/toolkit';
import { FixitAction } from '../models/common/fixitAction';

export interface AddressQueryItemModel {
  placeId: string;
  description: string;
}
export enum AddressItemTypes {
  UKNOWN = 0,
  STREET_ADDRESS = 1,
  ROUTE = 2,
  INTERSECTION = 3,
  POLITICAL = 4,
  COUNTRY = 5,
  ADMINISTRATIVE_AREA_LEVEL_1 = 6,
  ADMINISTRATIVE_AREA_LEVEL_2 = 7,
  ADMINISTRATIVE_AREA_LEVEL_3 = 8,
  ADMINISTRATIVE_AREA_LEVEL_4 = 9,
  ADMINISTRATIVE_AREA_LEVEL_5 = 10,
  COLLOQUIAL_AREA = 11,
  LOCALITY = 12,
  WARD = 13,
  SUBLOCALITY = 14,
  SUBLOCALITY_LEVEL_1 = 15,
  SUBLOCALITYLEVEL2 = 16,
  SUBLOCALITY_LEVEL_3 = 17,
  SUBLOCALITY_LEVEL_4 = 18,
  SUBLOCALITY_LEVEL_5 = 19,
  NEIGHBORHOOD = 20,
  PREMISE = 21,
  SUBPREMISE = 22,
  POSTAL_CODE = 23,
  NATURAL_FEATURE = 24,
  AIRPORT = 25,
  PARK = 26,
  FLOOR = 27,
  ESTABLISHMENT = 28,
  POINT_OF_INTEREST = 29,
  PARKING = 30,
  POST_BOX = 31,
  POSTAL_TOWN = 32,
  ROOM = 33,
  STREET_NUMBER = 34,
  BUS_STATION = 35,
  TRAIN_STATION = 36,
  TRANSIT_STATION = 37,
  GEOCODE = 38,
  POSTAL_CODE_PREFIX = 39,
  POSTAL_CODE_SUFFIX = 40,
  PLUS_CODE = 41,
}
export interface AddressComponentModel {
  shortName: string;
  longName: string;
  types: Array<AddressItemTypes>;
}
export interface AddressModel {
  formattedAddress: string;
  AddressComponents: Array<AddressComponentModel>;
}
export interface AddressQueryStateWithAction {
  addressQueries: Array<AddressQueryItemModel>;
  isLoading: boolean;
  error: any;
}
export interface AddressStateWithAction {
  address: AddressModel;
  isLoading: boolean;
  error: any;
}
export interface AddressState {
  readonly queriedAddresses: AddressQueryStateWithAction;
  readonly selectedAddress: AddressStateWithAction;
}

export const addressInitialState: AddressState = {
  queriedAddresses: {
    error: null,
    isLoading: false,
    addressQueries: [],
  },
  selectedAddress: {
    error: null,
    isLoading: false,
    address: {
      AddressComponents: [],
      formattedAddress: '',
    },
  },
};

const prepareSuccess = <T>(payload: T): FixitAction<T> => ({
  payload,
  type: 'inherit',
  meta: 'empty',
  error: null,
});

const prepareFailure = <T>(error: any): FixitAction<T> => ({
  payload: {} as T,
  type: 'inherit',
  meta: 'empty',
  error,
});

const addressSlice = createSlice({
  name: 'address',
  initialState: addressInitialState,
  reducers: {
    FETCH_ADDRESSESBYSEARCH_BEGIN: (state: AddressState) => {
      state.queriedAddresses.error = null;
      state.queriedAddresses.isLoading = true;
    },
    FETCH_ADDRESSESBYSEARCH_SUCCESS: {
      reducer: (state: AddressState, action: FixitAction<Array<AddressQueryItemModel>>) => {
        state.queriedAddresses.addressQueries = action.payload;
        state.queriedAddresses.isLoading = false;
        state.queriedAddresses.error = null;
      },
      prepare: (payload: Array<AddressQueryItemModel>) => prepareSuccess(payload),
    },
    FETCH_ADDRESSESBYSEARCH_FAILURE: {
      reducer: (state: AddressState, action: FixitAction<AddressModel>) => {
        state.queriedAddresses.isLoading = false;
        state.queriedAddresses.error = action.error;
      },
      prepare: (error: any) => prepareFailure<AddressModel>(error),
    },
    FETCH_ADDRESSBYID_BEGIN: (state: AddressState) => {
      state.selectedAddress.error = null;
      state.selectedAddress.isLoading = true;
    },
    FETCH_ADDRESSBYID_SUCCESS: {
      reducer: (state: AddressState, action: FixitAction<AddressModel>) => {
        state.selectedAddress.address = action.payload;
        state.selectedAddress.isLoading = false;
        state.selectedAddress.error = null;
      },
      prepare: (payload: AddressModel) => prepareSuccess(payload),
    },
    FETCH_ADDRESSBYID_FAILURE: {
      reducer: (state: AddressState, action: FixitAction<AddressModel>) => {
        state.selectedAddress.isLoading = false;
        state.selectedAddress.error = action.error;
      },
      prepare: (error: any) => prepareFailure<AddressModel>(error),
    },
  },
});

export const {
  FETCH_ADDRESSESBYSEARCH_BEGIN,
  FETCH_ADDRESSESBYSEARCH_SUCCESS,
  FETCH_ADDRESSESBYSEARCH_FAILURE,
  FETCH_ADDRESSBYID_BEGIN,
  FETCH_ADDRESSBYID_SUCCESS,
  FETCH_ADDRESSBYID_FAILURE,
} = addressSlice.actions;
export default addressSlice.reducer;
