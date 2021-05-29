import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackNavigatorProps } from '../navigators/homeStackNavigatorModel';

type SearchResultsScreenNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'SearchResultsScreen'
>;

export type SearchResultsScreenProps = {
  navigation: SearchResultsScreenNavigationProps;
  tags: string[];
};
