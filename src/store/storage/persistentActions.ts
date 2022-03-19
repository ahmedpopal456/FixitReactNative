import PersistentActionTypesModel from '../models/persistentStore/persistentActionTypesModel';
import {
  SetPushChannelTokenActionModel,
  SetUserAddressActionModel,
} from '../models/persistentStore/persistentActionModel';
import { UserAddressModel } from '../slices/userSlice';

const setPushChannelToken = (pushChannelToken: string): SetPushChannelTokenActionModel => ({
  type: PersistentActionTypesModel.SET_NOTIFICATION_TOKEN,
  payload: {
    pushChannelToken,
  },
});

const setCurrentFixLocations = (userAddress: UserAddressModel): SetUserAddressActionModel => ({
  type: PersistentActionTypesModel.SET_CURRENT_FIX_LOCATION,
  payload: {
    currentFixLocation: userAddress,
  },
});

export default {
  setPushChannelToken,
  setCurrentFixLocations,
};
