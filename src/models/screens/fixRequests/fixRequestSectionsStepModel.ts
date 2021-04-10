import { StackNavigationProp } from '@react-navigation/stack';
import { FixRequestObjModel } from 'fixit-common-data-store';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixRequestSectionsStepNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestSectionsStep'
>;

export type FixRequestSectionsStepProps = {
  navigation: FixRequestSectionsStepNavigationProps;
  fixRequest: FixRequestObjModel;
  fixStepsDynamicRoutes: {
    key:string,
  }[],
  numberOfSteps: number;
  fixStepsCurrentRouteIndex: number;
  fixTemplateId:string;
};
