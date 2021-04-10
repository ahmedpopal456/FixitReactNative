import { StackNavigationProp } from '@react-navigation/stack';
import { FixesModel, FixRequestObjModel } from 'fixit-common-data-store';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixSuggestChangesReviewNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixSuggestChangesReview'
>;

export type FixSuggestChangesReviewProps = {
  navigation: FixSuggestChangesReviewNavigationProps;
  passedFix: FixesModel;
  fixRequestObj: FixRequestObjModel,
  cost: string,
  comments: string,
};
