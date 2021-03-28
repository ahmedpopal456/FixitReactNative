import { StackNavigationProp } from '@react-navigation/stack';
import { FixRequestObjModel } from 'fixit-common-data-store';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixRequestScheduleStepNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestScheduleStep'
>;

export type FixRequestScheduleStepProps = {
  navigation: FixRequestScheduleStepNavigationProps,
  clientMinEstimatedCost: string,
  clientMaxEstimatedCost: string,
  fixRequestObj: FixRequestObjModel,
  fixStepsDynamicRoutes: {
    key:string,
  }[],
  numberOfSteps: number,
};
