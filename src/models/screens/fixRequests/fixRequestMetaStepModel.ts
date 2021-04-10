import { StackNavigationProp } from '@react-navigation/stack';
import { FixRequestObjModel } from 'fixit-common-data-store';
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
  numberOfSteps: number;
  templateId: string;
  fixObj: FixRequestObjModel;
};

export type FixRequestMetaStepScreenState = {
  titleFieldVisible: boolean;
  titleFieldTextVisible: boolean;
  tagSuggestionsVisible: boolean;
  suggestedTags: string[];
  tagInputText: string;
  categories?: {id: string, name: string, skills: {id:string, name:string}[]}[];
  types?: {id:string, name:string}[];
  units?: {id:string, name:string}[];
}
