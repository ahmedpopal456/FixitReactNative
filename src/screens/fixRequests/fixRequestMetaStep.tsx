import {
  Icon, P, Spacer, H2, Tag,
} from 'fixit-common-ui';
import React from 'react';
import {
  TouchableOpacity, View, Text,
} from 'react-native';
import {
  store, fixRequestActions, connect, StoreState, rootContext,
} from 'fixit-common-data-store';
import FormNextPageArrows from '../../components/formNextPageArrows';
import StyledContentWrapper from '../../components/styledElements/styledContentWrapper';
import FixRequestHeader from '../../components/fixRequestHeader';
import StyledScrollView from '../../components/styledElements/styledScrollView';
import StepIndicator from '../../components/stepIndicator';
import StyledPageWrapper from '../../components/styledElements/styledPageWrapper';
import FormTextInput from '../../components/formTextInput';
import GlobalStyles from '../../components/styles/fixRequests/globalStyles';
import FixRequestStyles from '../../components/styles/fixRequests/fixRequestStyles';
import FadeInAnimator from '../../animators/fadeInAnimator';
import { FixRequestMetaStepScreenProps, FixRequestMetaStepScreenState } from '../../models/screens/fixRequests/fixRequestMetaStepModel';

class FixRequestMetaStep extends
  React.Component<FixRequestMetaStepScreenProps> {
    state : FixRequestMetaStepScreenState ={
      titleFieldVisible: false,
      titleFieldTextVisible: true,
      tagSuggestionsVisible: false,
      // TODO: retrieve this from the backend
      suggestedTags: ['kitchen', 'bathroom', 'fireplace', 'TV room'],
      tagInputText: '',
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
        if (tag.Name === currentText) {
          isTagAlreadySaved = true;
        }
      });

      this.setState({
        tagInputText: '',
      });

      if (!isTagAlreadySaved) {
        store.dispatch(fixRequestActions.addFixRequestTag(currentText));
      }
    }

    removeTag = (tag : string) : void => {
      const tagArr = this.props.tags;
      let index = -1;
      for (let i = 0; i < tagArr.length; i += 1) {
        if (tagArr[i].Name === tag) {
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

      store.dispatch(fixRequestActions.addFixRequestTag(tag));
    }

    render() : JSX.Element {
      return (
        <>
          <FixRequestHeader showBackBtn={true} navigation={this.props.navigation} screenTitle="Create a Fixit Template and your Fixit Request" textHeight={60}/>
          <StyledPageWrapper>
            <StepIndicator
              numberSteps={this.props.currentStep}
              currentStep={1} />
            <StyledScrollView keyboardShouldPersistTaps={'handled'}>
              <StyledContentWrapper>
                <P>This section will be part of your new Fixit Template.
                You can fill in the fields with your requirement.</P>
                <Spacer height="20px" />
                <H2 style={GlobalStyles.boldTitle}>Template Name</H2>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={
                    (text : string) => store.dispatch(fixRequestActions.setFixTemplateName(text))
                  }
                  value={this.props.templateName} />
                <Spacer height="20px" />
                <H2 style={GlobalStyles.boldTitle}>Category</H2>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={
                    (text : string) => store
                      .dispatch(fixRequestActions.setFixTemplateCategory(text))
                  }
                  value={this.props.templateCategory} />
                <Spacer height="20px" />
                <H2 style={GlobalStyles.boldTitle}>Type</H2>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={
                    (text : string) => store.dispatch(fixRequestActions.setFixTemplateType(text))
                  }
                  value={this.props.templateType} />
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
                      (text : string) => store.dispatch(fixRequestActions.setFixTitle(text))
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
                  {this.props.tags.map((tag:{Name:string}) => (
                    tag
                      ? <View key={tag.Name} style={FixRequestStyles.fixTagWrapper}>
                        <Tag backgroundColor={'accent'} textColor={'dark'}>{tag.Name}</Tag>
                        <TouchableOpacity style={{ flexGrow: 0, marginLeft: -5 }}
                          onPress={() => this.removeTag(tag.Name)}>
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
    tags: state.fixRequest.fixRequestObj.Tags,
    templateName: state.fixRequest.fixRequestObj.Details[0].Name,
    templateCategory: state.fixRequest.fixRequestObj.Details[0].Category,
    templateType: state.fixRequest.fixRequestObj.Details[0].Type,
    fixTitle: state.fixRequest.fixRequestObj.Details[0].Name,
    currentStep: state.fixRequest.numberOfSteps,
  };
}

export default connect(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mapStateToProps, null, null, { context: rootContext },
)(FixRequestMetaStep);
