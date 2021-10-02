import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { PropsWithChildren } from 'react';

export interface AddressSelectorScreenProps extends PropsWithChildren<any>{
    /** Navigation Stack */
    navigation: StackNavigationProp<ParamListBase, string>,
  }
