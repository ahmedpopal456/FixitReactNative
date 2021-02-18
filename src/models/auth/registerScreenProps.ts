import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
  };

type RegisterScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'Auth'
>;

export type RegisterScreenProps = {
  navigation: RegisterScreenNavigationProps;
};
