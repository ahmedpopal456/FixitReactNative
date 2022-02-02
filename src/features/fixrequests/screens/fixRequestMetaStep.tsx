import { Icon, P, Spacer, H2, Tag } from 'fixit-common-ui';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import {
  store,
  fixRequestActions,
  fixTemplateActions,
  StoreState,
  Category,
  Type,
  Unit,
  useSelector,
} from 'fixit-common-data-store';

import { useNavigation } from '@react-navigation/native';
import { FormNextPageArrows } from '../../../components/forms';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import GlobalStyles from '../../../common/styles/globalStyles';
import FadeInAnimator from '../../../common/animators/fadeInAnimator';
import StepIndicator from '../../../components/stepIndicator';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import FixRequestStyles from '../styles/fixRequestStyles';
import { FixRequestHeader, FixTemplateFormTextInput, FixTemplatePicker } from '../components';
import fixRequestConstants from './constants';
import NavigationEnum from '../../../common/enums/navigationEnum';

const FixRequestMetaStep: FunctionComponent = (): JSX.Element => {
  const navigation = useNavigation();
  const fixTemplate = useSelector((storeState: StoreState) => storeState.fixTemplate);
  const [tagSuggestionsVisible, setTagSuggestionsVisible] = useState<boolean>(false);
  const [tagInputText, setTagInputText] = useState<string>('');
  const [suggestedTags, setSuggestedTags] = useState<Array<string>>([]);
  const [templateTags, setTemplateTags] = useState<Array<string>>([]);
  const [templateName, setTemplateName] = useState<string>('');
  const [templateCategory, setTemplateCategory] = useState<Category>(fixTemplate.workCategory);
  const [templateType, setTemplateType] = useState<Type>(fixTemplate.workType);
  const [templateUnit, setTemplateUnit] = useState<Unit>(fixTemplate.fixUnit);
  const [templateCategoryName, setTemplateCategoryName] = useState<string>(fixTemplate.workCategory.name);
  const [templateTypeName, setTemplateTypeName] = useState<string>(fixTemplate.workType.name);
  const [templateUnitName, setTemplateUnitName] = useState<string>(fixTemplate.fixUnit.name);

  useEffect(() => {
    setTemplateName(fixTemplate.name);
    setTemplateCategory(fixTemplate.workCategory);
    setTemplateType(fixTemplate.workType);
    setTemplateUnit(fixTemplate.fixUnit);
    setTemplateTags(fixTemplate.tags);
  }, [fixTemplate.name, fixTemplate.workCategory, fixTemplate.workType, fixTemplate.fixUnit, fixTemplate.tags]);

  const handleNextStep = (): void => {
    store.dispatch(
      fixTemplateActions.updateFixTemplate({
        name: templateName,
        workCategory: templateCategory,
        workType: templateType,
        fixUnit: templateUnit,
        tags: templateTags,
      }),
    );

    navigation.navigate(NavigationEnum.FIXREQUESTDESCRIPTIONSTEP);
  };

  const addTag = (): void => {
    const updateTemplateTags = [...templateTags];
    const isTag = updateTemplateTags.indexOf(tagInputText);
    if (isTag === -1) {
      updateTemplateTags.push(tagInputText);
      setTemplateTags(updateTemplateTags);
    }
    setTagInputText('');
  };

  const removeTag = (tag: string): void => {
    const updateTemplateTags = [...templateTags];
    const tagToRemoveIndex = updateTemplateTags.indexOf(tag);
    if (tagToRemoveIndex > -1) {
      updateTemplateTags.splice(tagToRemoveIndex, 1);
      setTemplateTags(updateTemplateTags);
    }
  };

  const addSuggestedTagToTagList = (tag: string): void => {
    const suggestedTagArr = suggestedTags;
    const index = suggestedTagArr.indexOf(tag);
    if (index > -1) {
      suggestedTagArr.splice(index, 1);
    }
    setSuggestedTags(suggestedTagArr);

    store.dispatch(fixRequestActions.addFixRequestTag({ name: tag }));
  };

  const suggestedTagsView = (): JSX.Element =>
    suggestedTags.length ? (
      <View style={FixRequestStyles.fixTagsWrapper}>
        <FadeInAnimator visible={tagSuggestionsVisible} style={FixRequestStyles.fixTagsAnimatedWrapper}>
          <P>Suggestions:</P>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {suggestedTags.map((tag: string) =>
              tag ? (
                <View key={tag} style={FixRequestStyles.fixTagWrapper}>
                  <TouchableOpacity
                    onPress={() => addSuggestedTagToTagList(tag)}
                    style={FixRequestStyles.fixTagTouchableWrapper}>
                    <Tag backgroundColor={'grey'} textColor={'light'}>
                      {tag}
                    </Tag>
                  </TouchableOpacity>
                </View>
              ) : null,
            )}
          </View>
        </FadeInAnimator>
      </View>
    ) : (
      <></>
    );

  const templateTagsList = (): JSX.Element => (
    <View style={FixRequestStyles.fixTagContainer}>
      {templateTags.map((tag: string) =>
        tag ? (
          <View key={tag} style={FixRequestStyles.fixTagWrapper}>
            <Tag backgroundColor={'accent'} textColor={'dark'}>
              {tag}
            </Tag>
            <TouchableOpacity style={{ flexGrow: 0, marginLeft: -5 }} onPress={() => removeTag(tag)}>
              <Icon library="FontAwesome5" name="times-circle" color={'dark'} />
            </TouchableOpacity>
          </View>
        ) : null,
      )}
    </View>
  );

  const templateTagsRender = (): JSX.Element => (
    <>
      <View style={GlobalStyles.flexRow}>
        <H2 style={FixRequestStyles.titleWithAction}>Tags</H2>
        <TouchableOpacity style={FixRequestStyles.titleActionWrapper} onPress={addTag}>
          <Text style={FixRequestStyles.titleActionLabel}>Add</Text>
        </TouchableOpacity>
      </View>
      <Spacer height="5px" />
      {suggestedTagsView()}
      <FixTemplateFormTextInput
        onChange={(text: string) => setTagInputText(text)}
        value={tagInputText}
        onFocus={() => setTagSuggestionsVisible(true)}
        onBlur={() => setTagSuggestionsVisible(false)}
      />
      {templateTagsList()}
    </>
  );

  const render = (): JSX.Element => (
    <>
      <FixRequestHeader
        showBackBtn={true}
        navigation={navigation}
        screenTitle="Create a Fixit Template and your Fixit Request"
        textHeight={60}
      />
      <StyledPageWrapper>
        <StepIndicator numberSteps={fixRequestConstants.NUMBER_OF_STEPS} currentStep={1} />
        <ScrollView>
          <StyledContentWrapper>
            <P>
              This section will be part of your new Fixit Template. You can fill in the fields with your requirement.
            </P>
            <Spacer height="20px" />
            <FixTemplateFormTextInput
              header={'Template Name'}
              value={templateName}
              onChange={(value: string) => setTemplateName(value)}
            />
            <Spacer height="20px" />
            <FixTemplatePicker
              header={'Category'}
              selectedValue={templateCategoryName}
              onChange={(value: string) => {
                setTemplateCategoryName(value);
                setTemplateCategory(
                  fixTemplate.categories.find((category: Category) => category.name === value) as Category,
                );
              }}
              values={fixTemplate.categories || []}
            />
            <Spacer height="20px" />
            <FixTemplatePicker
              header={'Type'}
              selectedValue={templateTypeName}
              onChange={(value: string) => {
                setTemplateTypeName(value);
                setTemplateType(fixTemplate.types.find((type: Type) => type.name === value) as Type);
              }}
              values={fixTemplate.types || []}
            />
            <Spacer height="20px" />
            <FixTemplatePicker
              header={'Unit'}
              selectedValue={templateUnitName}
              onChange={(value: string) => {
                setTemplateUnitName(value);
                setTemplateUnit(fixTemplate.units.find((unit: Unit) => unit.name === value) as Unit);
              }}
              values={fixTemplate.units || []}
            />
            <Spacer height="30px" />
            {templateTagsRender()}
          </StyledContentWrapper>
        </ScrollView>
      </StyledPageWrapper>
      <FormNextPageArrows mainClick={handleNextStep} />
    </>
  );
  return render();
};

export default FixRequestMetaStep;
