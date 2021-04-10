import { StackNavigationProp } from '@react-navigation/stack';
import { FixesModel, FixRequestObjModel } from 'fixit-common-data-store';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixSuggestChangesNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixSuggestChanges'
>;

export type FixSuggestChangesProps = {
  navigation: FixSuggestChangesNavigationProps;
  passedFix: FixesModel;
  fixRequestObj: FixRequestObjModel,
};
