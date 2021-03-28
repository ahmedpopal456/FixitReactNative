import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackNavigatorProps } from '../navigators/homeStackNavigatorModel';

type HomeScreenNavigationProps = StackNavigationProp<
    HomeStackNavigatorProps,
    'HomeScreen'
>;

export type HomeScreenProps = {
  navigation: HomeScreenNavigationProps;
};
