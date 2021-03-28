import { StackNavigationProp } from '@react-navigation/stack';
import { FixRequestObjModel } from 'fixit-common-data-store';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixRequestReviewNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestReview'
>;

export type FixRequestReviewProps = {
  navigation: FixRequestReviewNavigationProps;
  fixRequestObj: FixRequestObjModel;
};
