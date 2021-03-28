import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixRequestImagesLocationStepNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestImagesLocationStep'
>;

export type FixRequestImagesLocationStepProps = {
  navigation: FixRequestImagesLocationStepNavigationProps;
  fixAddress: string;
  fixCity: string;
  fixProvince: string;
  fixPostalCode: string;
  fixStepsDynamicRoutes: {
    key:string,
  }[],
  numberOfSteps: number,
};
