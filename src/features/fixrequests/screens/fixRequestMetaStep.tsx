import {
  Icon, P, Spacer, H2, Tag,
} from 'fixit-common-ui';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import {
  TouchableOpacity, View, Text,
} from 'react-native';
import {
  store, fixRequestActions, connect, StoreState, FixRequestService, FixRequestModel, TagModel,
} from 'fixit-common-data-store';
import { StackNavigationProp } from '@react-navigation/stack';
import { FormTextInput, FormNextPageArrows } from '../../../components/forms/index';
import { HomeStackNavigatorProps } from '../../../common/models/navigators/homeStackNavigatorModel';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import GlobalStyles from '../../../common/styles/globalStyles';
import FadeInAnimator from '../../../common/animators/fadeInAnimator';
import StepIndicator from '../../../components/stepIndicator';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import FixRequestStyles from '../styles/fixRequestStyles';
import FixRequestHeader from '../components/fixRequestHeader';

type FixRequestMetaStepScreenNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestMetaStep'
>;

export type FixRequestMetaStepScreenProps = {
  navigation: FixRequestMetaStepScreenNavigationProps;
  tags: Array<TagModel>;
  templateName: string;
  templateCategory: string;
  templateType: string;
  fixTitle: string;
  numberOfSteps: number;
  templateId: string;
  fixObj: FixRequestModel;
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

class FixRequestMetaStep extends
  React.Component<FixRequestMetaStepScreenProps> {
    state : FixRequestMetaStepScreenState ={
      titleFieldVisible: false,
      titleFieldTextVisible: true,
      tagSuggestionsVisible: false,
      // TODO: retrieve this from the backend
      suggestedTags: ['kitchen', 'bathroom', 'fireplace', 'TV room'],
      tagInputText: '',
      categories: undefined,
      types: undefined,
      units: undefined,
    }

    componentDidMount = async () : Promise<void> => {
      const serv = new FixRequestService(store);
      this.setState({
        categories: await serv.getCategories(),
        types: await serv.getTypes(),
        units: await serv.getUnits(),
      });
    }

    handleNextStep = () : void => {
      this.props.navigation.navigate('FixRequestDescriptionStep');
    }

    showTitleField = () : void => {
      this.setState({ titleFieldVisible: true, titleFieldTextVisible: false });
    }

    setTagInputText = (text:string) : void => {
      this.setState({ tagInputText: text });
    }

    addTag = () : void => {
      const currentText = this.state.tagInputText;

      let isTagAlreadySaved = false;
      this.props.tags.forEach((tag) => {
        if (tag.name === currentText) {
          isTagAlreadySaved = true;
        }
      });

      this.setState({
        tagInputText: '',
      });

      if (!isTagAlreadySaved) {
        store.dispatch(fixRequestActions.addFixRequestTagName({ name: currentText }));
      }
    }

    removeTag = (tag : string) : void => {
      const tagArr = this.props.tags;
      let index = -1;
      for (let i = 0; i < tagArr.length; i += 1) {
        if (tagArr[i].name === tag) {
          index = i;
        }
      }
      if (index > -1) {
        tagArr.splice(index, 1);
      }
      store.dispatch(fixRequestActions.setFixRequestTags(tagArr));
      this.forceUpdate();
    }

    showTagSuggestions = () : void => {
      this.setState({ tagSuggestionsVisible: true });
    }

    hideTagSuggestions = () : void => {
      this.setState({ tagSuggestionsVisible: false });
    }

    addSuggestedTagToTagList = (tag : string) : void => {
      const suggestedTagArr = this.state.suggestedTags;
      const index = suggestedTagArr.indexOf(tag);
      if (index > -1) {
        suggestedTagArr.splice(index, 1);
      }

      this.setState({
        suggestedTags: suggestedTagArr,
      });

      this.setState(() => ({
        suggestedTags: suggestedTagArr,
      }));

      store.dispatch(fixRequestActions.addFixRequestTagName({ name: tag }));
    }

    render() : JSX.Element {
      return (
        <>
          <FixRequestHeader
            showBackBtn={true}
            navigation={this.props.navigation}
            screenTitle="Create a Fixit Template and your Fixit Request"
            textHeight={60}/>
          <StyledPageWrapper>
            <StepIndicator
              numberSteps={
                this.props.templateId
                  ? this.props.numberOfSteps + this.props.fixObj.details.sections.length
                  : this.props.numberOfSteps
              }
              currentStep={1} />
            <StyledScrollView testID='styledScrollView' keyboardShouldPersistTaps={'handled'}>
              <StyledContentWrapper>
                <P>This section will be part of your new Fixit Template.
                You can fill in the fields with your requirement.</P>
                <Spacer height="20px" />
                <H2 style={GlobalStyles.boldTitle}>Template Name</H2>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={
                    (text : string) => store.dispatch(fixRequestActions.setFixTemplateName({ name: text }))
                  }
                  value={this.props.templateName} />
                <Spacer height="20px" />
                <H2 style={GlobalStyles.boldTitle}>Category</H2>
                <Spacer height="5px" />
                {this.state.categories
                  ? <Picker
                    selectedValue={this.props.templateCategory}
                    onValueChange={(value) => store
                      .dispatch(fixRequestActions.setFixTemplateCategory({ category: value }))
                    }>
                    {this.state.categories.map((category:{
                      id:string,
                      name:string,
                      skills: {
                        id:string,
                        name:string
                      }[]}) => (
                      <Picker.Item key={category.id} label={category.name} value={category.name} />
                    ))}
                  </Picker>
                  : null
                }
                <Spacer height="20px" />
                <H2 style={GlobalStyles.boldTitle}>Type</H2>
                <Spacer height="5px" />
                {this.state.types
                  ? <Picker
                    selectedValue={this.props.templateType}
                    onValueChange={(value) => {
                      console.log(value);
                      store
                        .dispatch(fixRequestActions.setFixTemplateType({ type: value }));
                    }}>
                    {this.state.types.map((type:{
                      id:string,
                      name:string
                    }) => (
                      <Picker.Item key={type.id} label={type.name} value={type.name} />
                    ))}
                  </Picker>
                  : null
                }
                <Spacer height="20px" />
                <H2 style={GlobalStyles.boldTitle}>Unit</H2>
                <Spacer height="5px" />
                {this.state.units
                  ? <Picker
                    selectedValue={this.props.fixObj.details.unit}
                    onValueChange={(value) => store
                      .dispatch(fixRequestActions.setFixTemplateType({ type: value }))
                    }>
                    {this.state.units.map((unit:{
                      id:string,
                      name:string
                    }) => (
                      <Picker.Item key={unit.id} label={unit.name} value={unit.name} />
                    ))}
                  </Picker>
                  : null
                }
                <Spacer height="20px" />
                <View style={GlobalStyles.flexRow}>
                  {/*
                  fix title is not a field in the DTO so it will always be the same as the name
                  */}
                  <H2 style={FixRequestStyles.titleWithAction}>Fix Title</H2>
                  <TouchableOpacity style={FixRequestStyles.titleActionWrapper}
                    onPress={this.showTitleField}>
                    <Text style={FixRequestStyles.titleActionLabel}>Change</Text>
                  </TouchableOpacity>
                </View>
                <FadeInAnimator visible={this.state.titleFieldTextVisible}>
                  <P>Same as Template Name</P>
                </FadeInAnimator>
                <FadeInAnimator visible={this.state.titleFieldVisible}>
                  <FormTextInput
                    onChange={
                      (text : string) => store.dispatch(
                        fixRequestActions.setFixSectionTitle({ sectionName: text, index: 0 }),
                      )
                    }
                    value={this.props.fixTitle} />
                </FadeInAnimator>
                <Spacer height="20px" />
                <Spacer height="10px" />
                <View style={GlobalStyles.flexRow}>
                  <H2 style={FixRequestStyles.titleWithAction}>Tags</H2>
                  <TouchableOpacity style={FixRequestStyles.titleActionWrapper}
                    onPress={this.addTag}>
                    <Text style={FixRequestStyles.titleActionLabel}>Add</Text>
                  </TouchableOpacity>
                </View>
                <Spacer height="5px" />
                <View style={FixRequestStyles.fixTagsWrapper}>
                  <FadeInAnimator
                    visible={this.state.tagSuggestionsVisible}
                    style={FixRequestStyles.fixTagsAnimatedWrapper}>
                    <P>Suggestions:</P>
                    <View style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                      {this.state.suggestedTags.map((tag:string) => (
                        tag
                          ? <View
                            key={tag}
                            style={FixRequestStyles.fixTagWrapper}>
                            <TouchableOpacity
                              onPress={() => this.addSuggestedTagToTagList(tag)}
                              style={FixRequestStyles.fixTagTouchableWrapper}
                            >
                              <Tag backgroundColor={'grey'} textColor={'light'}>{tag}</Tag>
                            </TouchableOpacity>
                          </View>
                          : null
                      ))}
                    </View>
                  </FadeInAnimator>
                </View>
                <FormTextInput
                  onChange={(text : string) => this.setTagInputText(text)}
                  value={this.state.tagInputText}
                  onFocus={() => this.showTagSuggestions() }
                  onBlur={() => this.hideTagSuggestions() }/>
                <View style={FixRequestStyles.fixTagContainer}>
                  {this.props.tags.map((tag:TagModel) => (
                    tag
                      ? <View key={tag.name} style={FixRequestStyles.fixTagWrapper}>
                        <Tag backgroundColor={'accent'} textColor={'dark'}>{tag.name}</Tag>
                        <TouchableOpacity style={{ flexGrow: 0, marginLeft: -5 }}
                          onPress={() => this.removeTag(tag.name)}>
                          <Icon library="FontAwesome5" name="times-circle" color={'dark'} />
                        </TouchableOpacity>
                      </View>
                      : null
                  ))}
                </View>
              </StyledContentWrapper>
            </StyledScrollView>
          </StyledPageWrapper>
          <FormNextPageArrows mainClick={this.handleNextStep} />
        </>
      );
    }
}

function mapStateToProps(state : StoreState) {
  return {
    tags: state.fixRequest.fixRequestObj.tags,
    templateName: state.fixRequest.fixRequestObj.details.name,
    templateCategory: state.fixRequest.fixRequestObj.details.category,
    templateType: state.fixRequest.fixRequestObj.details.type,
    fixTitle: state.fixRequest.fixRequestObj.details.name,
    numberOfSteps: state.fixRequest.numberOfSteps,
    templateId: state.fixRequest.fixTemplateId,
    fixObj: state.fixRequest.fixRequestObj,
  };
}

export default connect(mapStateToProps)(FixRequestMetaStep);
