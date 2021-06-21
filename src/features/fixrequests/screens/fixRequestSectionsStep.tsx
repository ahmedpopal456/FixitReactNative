import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  colors,
  Divider,
  H2, Icon, P, Spacer,
} from 'fixit-common-ui';
import {
  connect,
  fixRequestActions,
  store,
  StoreState,
  FixRequestService,
  FixTemplateObjectModel,
  FixRequestModel,
  SectionModel,
  SectionDetailsModel,
  TagModel,
} from 'fixit-common-data-store';
import { StackNavigationProp } from '@react-navigation/stack';
import { FormTextInput, FormNextPageArrows } from '../../../components/forms/index';
import { StepIndicator } from '../../../components/index';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import { HomeStackNavigatorProps } from '../../../common/models/navigators/homeStackNavigatorModel';
import { FixRequestHeader } from '../components';

type FixRequestSectionsStepNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestSectionsStep'
>;

export type FixRequestSectionsStepProps = {
  navigation: FixRequestSectionsStepNavigationProps;
  fixRequest: FixRequestModel;
  fixStepsDynamicRoutes: {
    key:string,
  }[],
  numberOfSteps: number;
  fixStepsCurrentRouteIndex: number;
  fixTemplateId:string;
};

class FixRequestSectionsStep extends
  React.Component<FixRequestSectionsStepProps> {
    unsubscribe: (() => void) | undefined;

    generateKey = (pre:string) : string => `${pre}_${new Date().getTime()}`

    componentDidMount = () : void => {
      const navState = this.props.navigation.dangerouslyGetState();
      const currentRouteKey = navState.routes[navState.index].key;
      let routeKeyIsInState = false;
      for (let i = 0; i < this.props.fixStepsDynamicRoutes.length; i += 1) {
        if (this.props.fixStepsDynamicRoutes[i].key === currentRouteKey) {
          routeKeyIsInState = true;
        }
      }

      if (!routeKeyIsInState) {
        store.dispatch(
          fixRequestActions.addFixStepsDynamicRoutes({ key: currentRouteKey }),
        );
      }

      this.unsubscribe = this.props.navigation.addListener(
        'focus',
        () => {
          this.forceUpdate();
          this.props.fixStepsDynamicRoutes.forEach((element, index) => {
            if (element.key === currentRouteKey) {
              store.dispatch(
                fixRequestActions.setCurrentFixStepsRouteIndex(
                  { routeIndex: index },
                ),
              );
            }
          });
        },
      );
    }

    componentWillUnmount = () : void => {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    generateNextPageOptions = () : {label:string, onClick: () => void}[] => {
      const nextPageOptionsObj = [{
        label: (this.props.fixTemplateId) ? 'Update Fixit Template & Continue' : 'Save Fixit Template & Continue',
        onClick: this.handleContinue,
      }];
      if (this.props.fixTemplateId
      && this.props.fixRequest.details.sections[this.props.fixStepsCurrentRouteIndex + 1]
      && !this.props.fixStepsDynamicRoutes[this.props.fixStepsCurrentRouteIndex + 1]) {
        return [
          ...nextPageOptionsObj,
          {
            label: 'Go to the next fix section',
            onClick: this.handleAddSection,
          },
        ];
      } if (this.props.fixStepsDynamicRoutes[this.props.fixStepsCurrentRouteIndex + 1]) {
        return [
          ...nextPageOptionsObj,
          {
            label: 'Go to the next fix section',
            onClick: () => {
              this.props.navigation.navigate({
                name: 'FixRequestSectionsStep',
                key: this.props.fixStepsDynamicRoutes[this.props.fixStepsCurrentRouteIndex + 1].key,
              });
            },
          },
        ];
      } return [...nextPageOptionsObj, { label: 'Add New Section', onClick: this.handleAddSection }];
    }

    handleContinue = () : void => {
      const serv = new FixRequestService(store);

      const tags : Array<TagModel> = [];
      this.props.fixRequest.tags.forEach((tag: { id?: string, name: string, }) : void => {
        tags.push({ name: tag.name });
      });

      const sections: {
          Name:string,
          Fields:{
              Name:string,
              Values:string[],
          }[]
      }[] = [];
      this.props.fixRequest.details.sections.forEach(
        (section: SectionModel) : void => {
          const fields : {
            Name:string,
            Values:string[],
          }[] = [];
          section.details.forEach((detail: SectionDetailsModel) : void => {
            fields.push({ Name: detail.name, Values: [detail.value] });
          });
          sections.push({ Name: section.name, Fields: fields });
        },
      );

      const fixTemplateObject : FixTemplateObjectModel = {
        Status: 'Public',
        Name: this.props.fixRequest.details.name,
        WorkTypeId: this.props.fixRequest.details.type,
        WorkCategoryId: this.props.fixRequest.details.category,
        FixUnitId: this.props.fixRequest.details.unit,
        Description: this.props.fixRequest.details.description,
        CreatedByUserId: store.getState().user.userId,
        UpdatedByUserId: store.getState().user.userId,
        Tags: tags,
        Sections: sections,
      };

      if (this.props.fixTemplateId) {
        serv.updateFixTemplate(fixTemplateObject, this.props.fixTemplateId);
      } else {
        serv.saveFixTemplate(fixTemplateObject);
      }
      this.props.navigation.navigate('FixRequestImagesLocationStep');
    }

    handleAddSection = () : void => {
      store.dispatch(fixRequestActions.setNumberOfSteps({ numberOfSteps: this.props.numberOfSteps + 1 }));
      const newIndex = this.props.fixStepsCurrentRouteIndex + 1;
      store.dispatch(
        fixRequestActions.setCurrentFixStepsRouteIndex({ routeIndex: newIndex }),
      );
      if (this.props.fixRequest.details.sections[newIndex]) {
        store.dispatch(fixRequestActions.setFixSectionDetails({
          details: this.props.fixRequest.details.sections[newIndex].details,
          index: newIndex,
        }));
      } else {
        store.dispatch(fixRequestActions.setFixSectionDetails({
          details:
          [{
            name: '',
            value: '',
          }],
          index: newIndex,
        }));
      }
      this.props.navigation.push('FixRequestSectionsStep');
    }

    handleAddFields = () : void => {
      const index = this.props.fixStepsCurrentRouteIndex;
      const details = [...this.props.fixRequest.details.sections[index].details, { name: '', value: '' }];
      store.dispatch(
        fixRequestActions.setFixSectionDetails({ index, details }),
      );
    }

    moveFields = (from:number, to:number) : void => {
      const index = this.props.fixStepsCurrentRouteIndex;
      const currSectionDetails = [...this.props.fixRequest.details.sections[index].details];
      currSectionDetails.splice(to, 0, currSectionDetails.splice(from, 1)[0]);
      store.dispatch(
        fixRequestActions.setFixSectionDetails({ details: currSectionDetails, index }),
      );
    }

    setFixSectionTitle = (
      text:string,
      index:number = this.props.fixStepsCurrentRouteIndex,
    ) : void => {
      store.dispatch(fixRequestActions.setFixSectionTitle({ sectionName: text, index }));
    }

    setFixSectionDetailsName = (inputText: string, index: number) : void => {
      const sectionIndex = this.props.fixStepsCurrentRouteIndex;
      const details = [...this.props.fixRequest.details.sections[sectionIndex].details];
      details[index] = {
        name: inputText,
        value: details[index].value,
      };
      store.dispatch(fixRequestActions.setFixSectionDetails({ details, index: sectionIndex }));
    }

    setFixSectionDetailsValue = (inputText: string, index:number) : void => {
      const sectionIndex = this.props.fixStepsCurrentRouteIndex;
      const details = [...this.props.fixRequest.details.sections[sectionIndex].details];
      details[index] = {
        name: details[index].name,
        value: inputText,
      };
      store.dispatch(fixRequestActions.setFixSectionDetails({ details, index: sectionIndex }));
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
              numberSteps={this.props.numberOfSteps}
              currentStep={3 + this.props.fixStepsCurrentRouteIndex} />
            <StyledScrollView>
              <StyledContentWrapper>
                <P>You can save your FixitTemplate and continue, or add more information.
                  You can then fill the fields with your requirements.</P>
                <Spacer height="20px" />
                <H2 style={{ fontWeight: 'bold' }}>Section Name</H2>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={(text : string) => this.setFixSectionTitle(text)}
                  value={
                    this.props.fixRequest.details
                      .sections[this.props.fixStepsCurrentRouteIndex].name
                  } />
                <Spacer height="20px" />
                <View style={{
                  flexDirection: 'row',
                  marginBottom: -20,
                }}>
                  <H2 style={{
                    fontWeight: 'bold',
                    flexGrow: 1,
                  }}>Fields</H2>
                  <TouchableOpacity style={{
                    flexGrow: 0,
                    marginTop: 5,
                  }}
                  onPress={this.handleAddFields}>
                    <Text style={{
                      color: colors.accent,
                      fontWeight: 'bold',
                      textDecorationLine: 'underline',
                    }}>Add</Text>
                  </TouchableOpacity>
                </View>
                <Divider />
                {this.props.fixRequest.details
                  .sections[this.props.fixStepsCurrentRouteIndex]
                  .details.map((f:{
                  name:string,
                  value:string
                }, index:number) => (
                    <View key={`${f.name}_k`}>
                      <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                        <View>
                          {(index !== 0)
                            ? <TouchableOpacity style={{
                              flexGrow: 0,
                              flexDirection: 'column',
                              justifyContent: 'center',
                            }}
                            onPress={() => this.moveFields(index, index - 1)}>
                              <Icon library="FontAwesome5" name="arrow-up" />
                            </TouchableOpacity>
                            : <></>}
                          {(this.props.fixRequest.details
                            .sections[this.props.fixStepsCurrentRouteIndex]
                            .details[index + 1])
                            ? <TouchableOpacity style={{
                              flexGrow: 0,
                              flexDirection: 'column',
                              justifyContent: 'center',
                            }}
                            onPress={() => this.moveFields(index, index + 1)}>
                              <Icon library="FontAwesome5" name="arrow-down" />
                            </TouchableOpacity>
                            : <></>}
                        </View>
                        <View style={{
                          flexGrow: 1,
                          marginLeft: 20,
                        }}>
                          <FormTextInput
                            title={'Field Title'}
                            value={f.name}
                            onChange={(text : string) => this.setFixSectionDetailsName(text, index)}/>
                          <Spacer height="20px" />
                          <FormTextInput
                            title={'Field Information'}
                            value={f.value}
                            onChange={(text : string) => this.setFixSectionDetailsValue(text, index)}/>
                        </View>
                      </View>
                      {(this.props.fixRequest.details
                        .sections[this.props.fixStepsCurrentRouteIndex]
                        .details[index + 1]) ? <Divider faded/> : <></>}
                    </View>
                  ))}
              </StyledContentWrapper>
            </StyledScrollView>
          </StyledPageWrapper>
          <FormNextPageArrows secondaryClickOptions={this.generateNextPageOptions()} />
        </>
      );
    }
}

function mapStateToProps(state : StoreState) {
  return {
    fixRequest: {
      ...state.fixRequest.fixRequestObj,
    },
    fixStepsCurrentRouteIndex: state.fixRequest.fixStepsCurrentRouteIndex,
    numberOfSteps: state.fixRequest.numberOfSteps,
    fixStepsDynamicRoutes: state.fixRequest.fixStepsDynamicRoutes,
    fixTemplateId: state.fixRequest.fixTemplateId,
  };
}

export default connect(mapStateToProps)(FixRequestSectionsStep);
