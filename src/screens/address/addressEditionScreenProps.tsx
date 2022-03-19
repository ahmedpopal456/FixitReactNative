import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { UserAddressModel } from '../../store';
import { PropsWithChildren } from 'react';

export interface AddressEditionScreenProps extends PropsWithChildren<any> {
  /** Address Selected */
  address: UserAddressModel;
  /** IsEdit View */
  IsEdit: boolean;
  /** Navigation Stack */
  navigation: StackNavigationProp<ParamListBase, string>;
}
