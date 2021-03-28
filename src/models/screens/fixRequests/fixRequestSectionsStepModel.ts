import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixRequestSectionsStepNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestSectionsStep'
>;

export type FixRequestSectionsStepProps = {
  navigation: FixRequestSectionsStepNavigationProps;
};

export type FixRequestSectionsStepScreenState = {
  fixSectionDetails: { name: string, value: string }[],
  fixSectionTitle: string,
  screenFields: { key: string, name: string, value: string }[],
}
