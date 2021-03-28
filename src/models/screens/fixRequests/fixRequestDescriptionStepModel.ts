import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixRequestDescriptionStepNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestDescriptionStep'
>;

export type FixRequestDescriptionStepProps = {
  navigation: FixRequestDescriptionStepNavigationProps;
  fixDescription: string;
};
