import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackNavigatorProps } from '../../navigators/homeStackNavigatorModel';

type FixRequestMetaStepScreenNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestMetaStep'
>;

export type FixRequestMetaStepScreenProps = {
  navigation: FixRequestMetaStepScreenNavigationProps;
  tags: {
    Name: string,
  }[];
  templateName: string;
  templateCategory: string;
  templateType: string;
  fixTitle: string;
  currentStep: number;
};

export type FixRequestMetaStepScreenState = {
  titleFieldVisible: boolean;
  titleFieldTextVisible: boolean;
  tagSuggestionsVisible: boolean;
  suggestedTags: string[];
  tagInputText: string;
}
