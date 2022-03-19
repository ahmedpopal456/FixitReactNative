import { UserAddressModel } from '../../slices/userSlice';

export interface PersistentStateModel {
  readonly pushChannelToken: string | undefined;
  readonly currentFixLocation: UserAddressModel;
}
