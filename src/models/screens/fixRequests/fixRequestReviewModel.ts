import { StackNavigationProp } from '@react-navigation/stack';
import { FixesModel, FixRequestObjModel } from 'fixit-common-data-store';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixRequestReviewNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestReview'
>;

export type FixRequestReviewProps = {
  navigation: FixRequestReviewNavigationProps;
  fixRequestObj: FixRequestObjModel;
  passedFix?: FixesModel;
  isFixCraftsmanResponseNotification?: boolean;
};
