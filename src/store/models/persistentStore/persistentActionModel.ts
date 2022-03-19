import { UserAddressModel } from '../../slices/userSlice';
import { ActionModel } from '../actionModel';

export interface SetPushChannelTokenActionModel extends ActionModel {
  payload: {
    pushChannelToken: string | undefined;
  };
}

export interface SetUserAddressActionModel extends ActionModel {
  payload: {
    currentFixLocation: UserAddressModel;
  };
}
