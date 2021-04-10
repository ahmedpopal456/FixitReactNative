import { StackNavigationProp } from '@react-navigation/stack';
import { FixRequestObjModel } from 'fixit-common-data-store';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixRequestDescriptionStepNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestDescriptionStep'
>;

export type FixRequestDescriptionStepProps = {
  navigation: FixRequestDescriptionStepNavigationProps;
  fixTemplateId: string,
  fixRequestObj: FixRequestObjModel,
  fixStepsDynamicRoutes:{
    key:string,
  }[],
  numberOfSteps: number,
};
